import unittest

from switchremoteplay.controller import SwitchController


class TestSwitchController(unittest.TestCase):
	def test_map_val(self):
		min_val = 0
		max_val = 0x1000 - 1
		# Mapping the horizontal axis: left (-1) to right (+1)
		assert SwitchController._map_val(-1, min_val, max_val) == min_val
		assert SwitchController._map_val(+1, min_val, max_val) == max_val
		self.assertEqual(SwitchController._map_val(0, min_val, max_val), int((min_val + max_val) / 2))
		assert SwitchController._map_val(-0.5, min_val, max_val) == int((min_val + max_val) / 4)
		assert SwitchController._map_val(+0.5, min_val, max_val) == int((min_val + max_val) * 3 / 4)

		# Mapping the vertical axis: up (-1) to down (+1)
		assert SwitchController._map_val(-1, max_val, min_val) == max_val
		assert SwitchController._map_val(+1, max_val, min_val) == min_val
		assert SwitchController._map_val(0, max_val, min_val) == int((min_val + max_val) / 2)
		assert SwitchController._map_val(-0.5, max_val, min_val) == int((min_val + max_val) * 3 / 4)
		assert SwitchController._map_val(+0.5, max_val, min_val) == int((min_val + max_val) / 4)

