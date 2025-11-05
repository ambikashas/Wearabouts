import ItemsPerType from "@/app/(tabs)/closet/type";
import { allOutfitItemTypes, typeDisplayNames } from "@/types/outfit";
import { render, screen } from "@testing-library/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";

// Mock router + search params
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

// Mock Dropdown
jest.mock("react-native-element-dropdown", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Dropdown: ({ value }: any) => {
      const typeDisplayNames: Record<string, string> = {
        top: "Tops",
        bottom: "Bottoms",
        shoes: "Shoes",
        full: "Fulls",
      };
      const displayValue = typeDisplayNames[value];
      return <Text testID="dropdown-value">{displayValue}</Text>;
    },
  };
});

// Mock ListVerticalScrollDisplay
jest.mock("@/components/ImageListVerticalScrollDisplay", () => {
  const React = require("react");
  const { Text, View } = require("react-native");

  const mockCounts: Record<string, number> = {
    top: 3,
    bottom: 2,
    shoes: 1,
    full: 0,
  };

  return {
    __esModule: true,
    default: ({ type }: any) => (
      <View testID="vertical-list">
        <Text>List({mockCounts[type] ?? 0} items)</Text>
      </View>
    ),
  };
});

describe("ItemsPerType (DB version)", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ type: "top" });
    const { toJSON } = render(<ItemsPerType />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders dropdown with correct label for selected type", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ type: "bottom" });
    render(<ItemsPerType />);
    const dropdown = screen.getByTestId("dropdown-value");
    expect(dropdown.props.children).toBe("Bottoms");
  });

  it("renders vertical list with correct number of items for each type", () => {
    allOutfitItemTypes.forEach((type) => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({ type });
      render(<ItemsPerType />);

      const expectedLabel = typeDisplayNames[type];
      const dropdown = screen.getByTestId("dropdown-value");
      expect(dropdown.props.children).toBe(expectedLabel);

      const countMap: Record<string, number> = {
        top: 3,
        bottom: 2,
        shoes: 1,
        full: 0,
      };
      expect(screen.getByText(`List(${countMap[type]} items)`)).toBeTruthy();
    });
  });

  it("renders 0 items if no items exist for the selected type", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ type: "full" });
    render(<ItemsPerType />);
    expect(screen.getByText("List(0 items)")).toBeTruthy();
  });
});
