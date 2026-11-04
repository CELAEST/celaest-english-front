/**
 * Calibrated symmetric standing neutral pose extracted from the Professor GLB rig (58 Mixamo bones).
 * Eliminates T-pose flash and anchors smooth real-time quaternion gestures.
 */

export const PROFESSOR_HIPS_NEUTRAL_POS: readonly [number, number, number] | null = [0.0182,0.63474,0.06885];

export const PROFESSOR_NEUTRAL_QUATERNIONS: Readonly<Record<string, readonly [number, number, number, number]>> = {
  "mixamorig:Head": [
    -0.028584,
    0.047193,
    -0.015572,
    0.998355
  ],
  "mixamorig:Neck": [
    -0.333473,
    0.017468,
    -0.011477,
    0.942528
  ],
  "mixamorig:LeftHandRing4": [
    -0.000262,
    -0.025682,
    -0.000707,
    0.99967
  ],
  "mixamorig:LeftHandRing3": [
    -0.165233,
    -0.000004,
    0.085225,
    0.982565
  ],
  "mixamorig:LeftHandRing2": [
    -0.150002,
    -0.000002,
    0.077357,
    0.985655
  ],
  "mixamorig:LeftHandRing1": [
    -0.211976,
    -0.412245,
    -0.051513,
    0.884572
  ],
  "mixamorig:LeftHandPinky4": [
    0.000002,
    -0.013021,
    0.00234,
    0.999912
  ],
  "mixamorig:LeftHandPinky3": [
    -0.154024,
    0.000006,
    0.010912,
    0.988007
  ],
  "mixamorig:LeftHandPinky2": [
    -0.154023,
    -0.000005,
    0.010915,
    0.988007
  ],
  "mixamorig:LeftHandPinky1": [
    -0.240521,
    -0.220357,
    -0.097929,
    0.940214
  ],
  "mixamorig:LeftHandMiddle4": [
    0.0005,
    -0.014299,
    0.00044,
    0.999898
  ],
  "mixamorig:LeftHandMiddle3": [
    -0.078626,
    -0.000002,
    0.092589,
    0.992595
  ],
  "mixamorig:LeftHandMiddle2": [
    -0.067403,
    0,
    0.079371,
    0.994564
  ],
  "mixamorig:LeftHandMiddle1": [
    -0.209683,
    -0.581195,
    -0.032644,
    0.785608
  ],
  "mixamorig:LeftHandThumb4": [
    -0.074462,
    0.012561,
    0.032595,
    0.996612
  ],
  "mixamorig:LeftHandThumb3": [
    -0.075306,
    0.11535,
    -0.137063,
    0.980937
  ],
  "mixamorig:LeftHandThumb2": [
    0.087448,
    0.0263,
    -0.065421,
    0.993671
  ],
  "mixamorig:LeftHandThumb1": [
    -0.269447,
    -0.854823,
    -0.157942,
    0.414403
  ],
  "mixamorig:LeftHand": [
    -0.186659,
    -0.054402,
    0.035912,
    0.98026
  ],
  "mixamorig:LeftForeArm": [
    0.103005,
    0.077181,
    -0.131731,
    0.982894
  ],
  "mixamorig:LeftArm": [
    -0.315866,
    0.376961,
    -0.376544,
    0.785076
  ],
  "mixamorig:LeftShoulder": [
    -0.649487,
    -0.529401,
    -0.464745,
    0.286206
  ],
  "mixamorig:RightHandPinky4": [
    0.000477,
    0.024884,
    -0.001246,
    0.999689
  ],
  "mixamorig:RightHandPinky3": [
    -0.129139,
    0.000002,
    -0.050841,
    0.990322
  ],
  "mixamorig:RightHandPinky2": [
    -0.23063,
    0.000003,
    -0.090766,
    0.968799
  ],
  "mixamorig:RightHandPinky1": [
    -0.199933,
    0.376763,
    0.0802,
    0.900913
  ],
  "mixamorig:RightHandRing4": [
    -0.000032,
    0.028925,
    0.000108,
    0.999582
  ],
  "mixamorig:RightHandRing3": [
    -0.180821,
    0.000003,
    -0.089485,
    0.979437
  ],
  "mixamorig:RightHandRing2": [
    -0.361636,
    0.000003,
    -0.178959,
    0.914982
  ],
  "mixamorig:RightHandRing1": [
    -0.159032,
    0.420722,
    0.081248,
    0.889438
  ],
  "mixamorig:RightHandMiddle4": [
    -0.001229,
    0.020729,
    0.001224,
    0.999784
  ],
  "mixamorig:RightHandMiddle3": [
    -0.118095,
    -0.000001,
    -0.1331,
    0.984042
  ],
  "mixamorig:RightHandMiddle2": [
    -0.201319,
    0.000001,
    -0.226898,
    0.952884
  ],
  "mixamorig:RightHandMiddle1": [
    -0.154047,
    0.587513,
    0.074574,
    0.790909
  ],
  "mixamorig:RightHandThumb4": [
    -0.072762,
    -0.051565,
    -0.039031,
    0.99525
  ],
  "mixamorig:RightHandThumb3": [
    -0.085449,
    0.073176,
    0.132648,
    0.984758
  ],
  "mixamorig:RightHandThumb2": [
    0.1435,
    -0.001269,
    0.136607,
    0.980176
  ],
  "mixamorig:RightHandThumb1": [
    -0.318997,
    0.849012,
    0.080736,
    0.413402
  ],
  "mixamorig:RightHand": [
    -0.101667,
    0.072273,
    0.014851,
    0.992079
  ],
  "mixamorig:RightForeArm": [
    0.087571,
    -0.078324,
    0.112276,
    0.986707
  ],
  "mixamorig:RightArm": [
    -0.290702,
    -0.371358,
    0.375968,
    0.797642
  ],
  "mixamorig:RightShoulder": [
    -0.670978,
    0.499951,
    0.460179,
    0.296771
  ],
  "mixamorig:Spine2": [
    0.534841,
    -0.024027,
    0.003351,
    0.844604
  ],
  "mixamorig:Spine1": [
    -0.106002,
    -0.023781,
    0.010692,
    0.994024
  ],
  "mixamorig:Spine": [
    0.194634,
    -0.055876,
    -0.056708,
    0.97764
  ],
  "mixamorig:LeftToe_End": [
    -0.067074,
    -0.961314,
    -0.048779,
    0.262673
  ],
  "mixamorig:LeftToeBase": [
    -0.448466,
    -0.794535,
    0.404165,
    0.065135
  ],
  "mixamorig:LeftFoot": [
    -0.298598,
    0.28395,
    -0.27733,
    0.867928
  ],
  "mixamorig:LeftLeg": [
    0.482205,
    -0.150123,
    0.104933,
    0.856698
  ],
  "mixamorig:LeftUpLeg": [
    0.983592,
    -0.035707,
    0.175542,
    -0.021386
  ],
  "mixamorig:RightToe_End": [
    -0.095955,
    0.971377,
    0.064615,
    0.207473
  ],
  "mixamorig:RightToeBase": [
    0.418076,
    -0.806863,
    0.416709,
    0.023194
  ],
  "mixamorig:RightFoot": [
    -0.399259,
    -0.247622,
    0.256169,
    0.84478
  ],
  "mixamorig:RightLeg": [
    0.59099,
    0.18464,
    -0.100875,
    0.778758
  ],
  "mixamorig:RightUpLeg": [
    -0.988752,
    0.06704,
    0.133326,
    -0.009977
  ],
  "mixamorig:Hips": [
    -0.258531,
    0.056645,
    0.041078,
    0.963465
  ]
};
