"use client";

import { useMemo, useState } from "react";
import type { Radiograph } from "@/lib/clinical-history/types";

interface UseRadiographsViewModelParams {
  radiographs: Radiograph[];
}

export function useRadiographsViewModel({
  radiographs,
}: UseRadiographsViewModelParams) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedImage, setSelectedImage] = useState<Radiograph | null>(null);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredRadiographs = useMemo(
    () =>
      radiographs.filter((radiograph) => {
        const matchesSearch =
          !normalizedSearch ||
          radiograph.description?.toLowerCase().includes(normalizedSearch) ||
          radiograph.toothNumbers?.some((number) =>
            String(number).includes(normalizedSearch)
          );

        const matchesType = typeFilter === "all" || radiograph.type === typeFilter;

        return Boolean(matchesSearch && matchesType);
      }),
    [radiographs, normalizedSearch, typeFilter]
  );

  const groupedByType = useMemo(
    () =>
      filteredRadiographs.reduce<Record<string, Radiograph[]>>(
        (accumulator, radiograph) => {
          if (!accumulator[radiograph.type]) {
            accumulator[radiograph.type] = [];
          }
          accumulator[radiograph.type].push(radiograph);
          return accumulator;
        },
        {}
      ),
    [filteredRadiographs]
  );

  const currentIndex = selectedImage
    ? filteredRadiographs.findIndex((radiograph) => radiograph.id === selectedImage.id)
    : -1;

  return {
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    viewMode,
    setViewMode,
    selectedImage,
    setSelectedImage,
    filteredRadiographs,
    groupedByType,
    currentIndex,
  };
}
