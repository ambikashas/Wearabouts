export const requestForegroundPermissionsAsync = jest.fn(() =>
  Promise.resolve({ status: "granted" })
);

export const getCurrentPositionAsync = jest.fn(() =>
  Promise.resolve({
    coords: { latitude: 47.6062, longitude: -122.3321 } // Seattle
  })
);
