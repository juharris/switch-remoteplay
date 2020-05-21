import unittest

from switchremoteplay.controller import SwitchController


class TestSwitchController(unittest.TestCase):
	def test_map_val(self):
		min_val = 0
		max_val = 0x1000
		assert SwitchController._map_val(-1, min_val, max_val) == min_val
		assert SwitchController._map_val(+1, min_val, max_val) == max_val
		assert SwitchController._map_val(0, min_val, max_val) == (min_val + max_val) / 2
		assert SwitchController._map_val(-0.5, min_val, max_val) == (min_val + max_val) / 4
		assert SwitchController._map_val(+0.5, min_val, max_val) == (min_val + max_val) * 3 / 4
