import asyncio
from logging import Logger

from joycontrol import logging_default as log
from joycontrol.controller import Controller
from joycontrol.controller_state import ControllerState, button_push
from joycontrol.memory import FlashMemory
from joycontrol.protocol import controller_protocol_factory
from joycontrol.server import create_hid_server


class SwitchController():
	def __init__(self, logger: Logger, controller_state: ControllerState):
		self._controller_state: ControllerState = controller_state
		self._logger = logger
		print("L CALIBRATION:")
		print(controller_state.l_stick_state.get_calibration())

	@staticmethod
	async def get_controller(logger: Logger, reconnect_bt_addr=None, spi_flash=None, controller='PRO_CONTROLLER',
							 capture_file=None,
							 device_id=None):

		log.configure(logger.level, logger.level)
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
		transport, protocol = await create_hid_server(factory, reconnect_bt_addr=reconnect_bt_addr,
													  ctl_psm=ctl_psm,
													  itr_psm=itr_psm, capture_file=capture_file,
													  device_id=device_id)

		controller_state: ControllerState = protocol.get_controller_state()

		return SwitchController(logger, controller_state)

	def __del__(self):
		self._controller_state._protocol.connection_lost()

	@staticmethod
	def _set_stick(stick, direction, value):
		if direction == 'center':
			stick.set_center()
		elif direction == 'up':
			stick.set_up()
		elif direction == 'down':
			stick.set_down()
		elif direction == 'left':
			stick.set_left()
		elif direction == 'right':
			stick.set_right()
		elif direction in ('h', 'horizontal'):
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
					# TODO Convert -1 to +1 to the calibrated values.
					val = int(value)
				except ValueError:
					raise ValueError(f'Unexpected stick value "{value}"')
			stick.set_h(val)
		elif direction in ('v', 'vertical'):
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
					val = int(value)
				# TODO Convert -1 to +1 to the calibrated values.
				except ValueError:
					raise ValueError(f'Unexpected stick value "{value}"')
			stick.set_v(val)
		else:
			raise ValueError(f'Unexpected argument "{direction}"')

		return f'{stick.__class__.__name__} was set to ({stick.get_h()}, {stick.get_v()}).'

	def run(self, command: str):
		self._logger.debug(command)
		if command in 'lrabxy':
			asyncio.ensure_future(button_push(self._controller_state, command))
		elif command.startswith('s'):
			command = command.split(' ')
			# TODO Support 's <stick> hv <h amount> <v amount>'
			assert len(command) >= 3
			if command[1] == 'l':
				stick = self._controller_state.l_stick_state
			else:
				stick = self._controller_state.r_stick_state
			direction = command[2]
			if len(command) > 3:
				value = command[3]
			else:
				value = None
			s = SwitchController._set_stick(stick, direction, value)
			self._logger.debug(s)
			asyncio.ensure_future(self._controller_state.send())
		else:
			command = command.split(' ')
			assert len(command) >= 2
			button = command[0]
			pushed = command[1] == 'd'
			self._controller_state.button_state.set_button(button, pushed)
			# Not sure if sending the state is needed but other methods use it.
			asyncio.ensure_future(self._controller_state.send())
