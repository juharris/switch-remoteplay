from joycontrol import logging_default as log, utils
#f rom joycontrol.command_line_interface import ControllerCLI
from joycontrol.controller import Controller
from joycontrol.controller_state import ControllerState, button_push
from joycontrol.memory import FlashMemory
from joycontrol.protocol import controller_protocol_factory
from joycontrol.server import create_hid_server

log.configure()


# Might need to be async
async def push_button(*args, **kwargs):
    return await button_push(*args, **kwargs)

async def get_controller(reconnect_bt_addr=None, spi_flash=None, controller='PRO_CONTROLLER', capture_file=None, device_id=None):
    # parse the spi flash
    if spi_flash:
        with open(spi_flash, 'rb') as spi_flash_file:
            spi_flash = FlashMemory(spi_flash_file.read())
    else:
        # Create memory containing default controller stick calibration
        spi_flash = FlashMemory()

    # Get controller name to emulate from arguments
    controller = Controller.from_arg(controller)
    print(f"controller: {controller}")
    print(f"capture_file: {capture_file}")
    factory = controller_protocol_factory(controller, spi_flash=spi_flash)
    ctl_psm, itr_psm = 17, 19
    transport, protocol = await create_hid_server(factory, reconnect_bt_addr=reconnect_bt_addr,
                                                  ctl_psm=ctl_psm,
                                                  itr_psm=itr_psm, capture_file=capture_file,
                                                  device_id=device_id)

    controller_state = protocol.get_controller_state()

    # Create command line interface and add some extra commands
    #cli = ControllerCLI(controller_state)
    return controller_state

