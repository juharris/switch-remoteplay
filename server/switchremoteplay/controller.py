import asyncio
from logging import Logger

from joycontrol import logging_default as log
from joycontrol.controller import Controller
from joycontrol.controller_state import ControllerState, button_push, StickState
from joycontrol.memory import FlashMemory
from joycontrol.protocol import controller_protocol_factory
from joycontrol.server import create_hid_server


class SwitchController():
	def __init__(self, logger: Logger, controller_state: ControllerState):
		self._controller_state: ControllerState = controller_state
		self._logger = logger

	@staticmethod
	def configure_log(level):
		log.configure(level, level)

	@staticmethod
	async def get_controller(logger: Logger, switch_mac_address=None, spi_flash=None, controller='PRO_CONTROLLER',
							 capture_file=None,
							 device_id=None):
		logger.info("Simulating a %s controller.", controller)
		if spi_flash:
			with open(spi_flash, 'rb') as spi_flash_file:
				spi_flash = FlashMemory(spi_flash_file.read())
		else:
			# Create memory containing default controller stick calibration
			spi_flash = FlashMemory()

		# Get controller name to emulate from arguments
		controller = Controller.from_arg(controller)
		factory = controller_protocol_factory(controller, spi_flash=spi_flash)
		ctl_psm, itr_psm = 17, 19
		if switch_mac_address:
			logger.info("Pairing with Switch MAC address: %s", switch_mac_address)
		while True:
			try:
				transport, protocol = await create_hid_server(factory, reconnect_bt_addr=switch_mac_address,
															  ctl_psm=ctl_psm,
															  itr_psm=itr_psm, capture_file=capture_file,
															  device_id=device_id)

				controller_state: ControllerState = protocol.get_controller_state()
				break
			except:
				# TODO Try to wake the Switch up from sleep.
				wait_s = 3
				logger.exception("Error pairing. Make sure your Switch is on."
								 " Will try again in %ds.", wait_s)
				await asyncio.sleep(wait_s)

		logger.info("Simulated %s paired.", controller.name)
		return SwitchController(logger, controller_state)

	def __del__(self):
		self._controller_state._protocol.connection_lost()

	def _map_h_val(self, stick, value):
		if value is None:
			raise ValueError(f'Missing value')
		if value == 'max':
			val = stick.get_calibration().h_center + stick.get_calibration().h_max_above_center
		elif value == 'min':
			val = stick.get_calibration().h_center - stick.get_calibration().h_max_below_center
		elif value == 'center':
			val = stick.get_calibration().h_center
		else:
			try:
				# LEFT: -1, RIGHT: +1
				left_val = stick.get_calibration().h_center - stick.get_calibration().h_max_below_center
				right_val = stick.get_calibration().h_center + stick.get_calibration().h_max_above_center
				val = SwitchController._map_val(float(value), left_val, right_val)
			except ValueError:
				raise ValueError(f'Unexpected stick value "{value}"')
		return val

	def _map_v_val(self, stick, value):
		if value is None:
			raise ValueError(f'Missing value')
		if value == 'max':
			val = stick.get_calibration().v_center + stick.get_calibration().v_max_above_center
		elif value == 'min':
			val = stick.get_calibration().v_center - stick.get_calibration().v_max_below_center
		elif value == 'center':
			val = stick.get_calibration().v_center
		else:
			try:
				# Match the JavaScript Gamepad API: UP: -1, DOWN: +1
				down_val = stick.get_calibration().v_center - stick.get_calibration().v_max_below_center
				up_val = stick.get_calibration().v_center + stick.get_calibration().v_max_above_center
				val = SwitchController._map_val(float(value), up_val, down_val)
			except ValueError:
				raise ValueError(f'Unexpected stick value "{value}"')
		return val

	@staticmethod
	def _map_val(val: float, min_val: float, max_val: float) -> int:
		"""
		:param val: A value in [-1, +1]
		:param min_val:
		:param max_val:
		:return: A mapped value linearly within [min_val, max_val]
		"""
		# y = a*x + b
		# min = a * (-1) + b
		# max = a * (+1) + b
		# a = (max - min)/2
		# b = (max + min)/2
		# y = (max - min)/2 * x + (max + min)/2
		# y = (x * (max - min) + (max + min))/2
		# Simplify to reduce the number of multiplications and divisions.
		return int((val * (max_val - min_val) + max_val + min_val) / 2)

	def _set_stick(self, stick: StickState, direction: str, value: str, vertical_value: str = None):
		if direction == 'hv':
			val = self._map_h_val(stick, value)
			stick.set_h(val)
			val = self._map_v_val(stick, vertical_value)
			stick.set_v(val)
		elif direction in ('h', 'horizontal'):
			val = self._map_h_val(stick, value)
			stick.set_h(val)
		elif direction in ('v', 'vertical'):
			val = self._map_v_val(stick, value)
			stick.set_v(val)
		elif direction == 'center':
			stick.set_center()
		elif direction == 'up':
			stick.set_up()
		elif direction == 'down':
			stick.set_down()
		elif direction == 'left':
			stick.set_left()
		elif direction == 'right':
			stick.set_right()
		else:
			raise ValueError(f'Unexpected argument "{direction}"')

		return f'{stick.__class__.__name__} was set to ({stick.get_h()}, {stick.get_v()}).'

	def is_connected(self) -> bool:
		return self._controller_state._protocol is not None and self._controller_state._protocol.transport is not None

	def run(self, command_input: str):
		self._logger.debug(command_input)
		for command_in_list in command_input.split(','):
			for command in command_in_list.split('&'):
				self.run_single_command(command)
			asyncio.ensure_future(self._controller_state.send())

	def run_single_command(self, command: str):
		if command.startswith('s'):
			command = command.split(' ')
			assert len(command) >= 3, "Command must have at least 3 tokens."
			if command[1] == 'l':
				stick = self._controller_state.l_stick_state
			else:
				stick = self._controller_state.r_stick_state
			direction = command[2]
			if len(command) > 4:
				value = command[3]
				vertical_value = command[4]
			elif len(command) > 3:
				value = command[3]
				vertical_value = None
			else:
				value = vertical_value = None
			s = self._set_stick(stick, direction, value, vertical_value)
			self._logger.debug(s)
		elif command in self._controller_state.button_state.get_available_buttons():
			# `button_push` sends the controller's state which could be a problem for running
			# simultaneous commands but it's documented in the API that it might not work well.
			asyncio.ensure_future(button_push(self._controller_state, command))
		else:
			command = command.split(' ')
			assert len(command) >= 2
			cmd = command[0]
			if cmd == 'wait':
				# TODO Don't allow any commands to be sent by this current connection.
				pass
			else:
				# Button
				pushed = command[1] == 'd'
				self._controller_state.button_state.set_button(cmd, pushed)
