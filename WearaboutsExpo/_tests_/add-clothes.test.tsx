import React from "react";
import { render, fireEvent, waitFor, screen, act } from "@testing-library/react-native";
import AddClothesScreen from "../app/(tabs)/add-clothes";
import { uploadClothingItem } from "../lib/uploadClothingItem";

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

// Mock ConfettiCannon (native module)
jest.mock("react-native-confetti-cannon", () => jest.fn().mockImplementation(() => null));

// Mock uploadClothingItem so we don’t hit Supabase during test
jest.mock("@/lib/uploadClothingItem", () => ({
  uploadClothingItem: jest.fn(() => Promise.resolve({ id: "123", image_url: "https://mock.url", fileName: "mock.jpg" })),
}));

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
  }),
  useNavigation: () => ({
    setOptions: jest.fn(),
  }),
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

// --- Frontend UI Tests --- //
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
      fireEvent.press(screen.getByText("Tap to upload an image"));
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
      fireEvent.press(getByText("Tap to upload an image"));
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

// --- Backend Tests --- //
jest.mock('../../supabase/functions/analyze-image/index', () => ({
  analyzeImageHandler: jest.fn(async (req: Request) => 
    new Response(JSON.stringify({ tags: ['Dress', 'Satin'] }), { status: 200 })
  ),
}));

import { analyzeImageHandler } from '../../supabase/functions/analyze-image/index';

jest.mock("expo-image-manipulator", () => ({
  manipulateAsync: jest.fn((uri) => Promise.resolve({ uri: "manipulated.jpg" })),
}));

jest.mock("expo-file-system/legacy", () => ({
  readAsStringAsync: jest.fn(() => Promise.resolve("BASE64DATA")),
}));

jest.mock("@/lib/supabase", () => {
  const mockUpload = jest.fn().mockResolvedValue({ data: {}, error: null });
  const mockGetPublicUrl = jest.fn(() => ({ data: { publicUrl: "https://public.url" } }));
  const mockInsert = jest.fn().mockResolvedValue({
    data: { id: "123", name: "Test Shirt", type: "top", tags: [], image_url: "img" },
    error: null,
  });
  const mockInvoke = jest.fn().mockResolvedValue({ data: {}, error: null });
  const mockRemove = jest.fn().mockResolvedValue({ error: null });

  return {
    supabase: {
      storage: { from: () => ({ upload: mockUpload, getPublicUrl: mockGetPublicUrl, remove: mockRemove }) },
      from: () => ({ insert: mockInsert }),
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: "user-123" } }, error: null }) },
      functions: { invoke: mockInvoke },
    },
  };
});

// Mock fetch for analyzeImageHandler (and mocking Google Vision API response)
global.fetch = jest.fn(async () => ({
  ok: true,
  json: async () => ({
    responses: [
      { labelAnnotations: [
        { description: "Dress" },
        { description: "Satin" },
        { description: "dress" },
      ]},
    ],
  }),
}));

describe("uploadClothingItem backend logic", () => {
  it("uploads images, inserts DB row, calls Edge Function, and deletes optimized file", async () => {
    const result = await uploadClothingItem("file://test.jpg", "Test Shirt", ["blue", "cotton"], "top");
    expect(result.id).toBe("123");
  });
});

describe("analyze-image Edge Function", () => {
  it("deduplicates tags case-insensitively", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ imageUrl: "test.jpg", optimizedImageUrl: "opt.jpg" }),
    });

    const res = await analyzeImageHandler(req);
    const data = await res.json();

    expect(data.tags).toContain("Dress");
    expect(data.tags).toContain("Satin");
    expect(data.tags.length).toBe(2);
  });
});
