import React from "react";
import { render, fireEvent, waitFor, screen, act } from "@testing-library/react-native";
import AddClothesScreen from "../app/(tabs)/add-clothes";

// 🧩 Mock expo-image-picker
jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: "file://mock-image.jpg" }],
    })
  ),
  MediaTypeOptions: { Images: "Images" },
}));

// 🧩 Mock ConfettiCannon (native module)
jest.mock("react-native-confetti-cannon", () => jest.fn().mockImplementation(() => null));

// 🧩 Mock uploadClothingItem so we don’t hit Supabase during test
jest.mock("@/lib/uploadClothingItem", () => ({
  uploadClothingItem: jest.fn(() => Promise.resolve({ image_url: "https://mock.url", fileName: "mock.jpg" })),
}));

jest.useFakeTimers();

function getDisabledState(node: any): boolean | undefined {
  try {
    let cur = node;
    for (let i = 0; i < 5 && cur; i++) {
      if (cur.props?.accessibilityState?.disabled !== undefined) {
        return cur.props.accessibilityState.disabled;
      }
      cur = cur.parent ?? cur._fiberReturn ?? cur._owner;
    }
  } catch {}
  return undefined;
}

describe("AddClothesScreen", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it("upload button is initially disabled", () => {
    render(<AddClothesScreen />);
    const uploadText = screen.getByText("Upload");
    const disabled = getDisabledState(uploadText);
    expect(disabled).toBe(true);
  });

  it("can pick an image, select type, and show delete (X) button", async () => {
    render(<AddClothesScreen />);

    // Pick image
    await act(async () => {
      fireEvent.press(screen.getByText("Tap to upload images"));
      await Promise.resolve();
    });

    // Wait for image X button
    await waitFor(() => {
      expect(screen.getByText("X")).toBeTruthy();
    });

    // Simulate selecting "Top" type from Picker
    const picker = screen.getByTestId("picker-type");
    fireEvent(picker, "onValueChange", "top");

    // Upload button should now be enabled
    const uploadText = screen.getByText("Upload");
    const disabledAfter = getDisabledState(uploadText);
    expect(disabledAfter).toBe(false);
  });

  it("clears images and shows success modal after upload", async () => {
    const { getByText, getByDisplayValue } = render(<AddClothesScreen />);

    // Pick image
    await act(async () => {
      fireEvent.press(getByText("Tap to upload images"));
      await Promise.resolve();
    });

    // Wait for upload button
    await waitFor(() => getByText("Upload"));

    // Select type (required)
    const picker = screen.getByTestId("picker-type");
    fireEvent(picker, "onValueChange", "top");

    // Upload
    await act(async () => {
      fireEvent.press(getByText("Upload"));
      jest.advanceTimersByTime(2000);
    });

    // Success modal appears
    await waitFor(() => {
      expect(getByText("Added to your closet!")).toBeTruthy();
    });

    // The delete “X” button should be gone after clearing images
    expect(screen.queryByText("X")).toBeNull();

    // Modal should close after timeout
    act(() => {
      jest.advanceTimersByTime(3100);
    });
  });
});
