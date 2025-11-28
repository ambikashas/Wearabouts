export const requestForegroundPermissionsAsync = jest.fn(() =>
  Promise.resolve({ status: "granted" })
);

export const getCurrentPositionAsync = jest.fn(() =>
  Promise.resolve({
    coords: {
      latitude: 37.7749,
      longitude: -122.4194, // just a dummy coordinate
    },
  })
);
