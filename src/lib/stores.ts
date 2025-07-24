import type {} from "@redux-devtools/extension";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { School } from "~/server/db/schema";

interface SchoolState {
  schools: Record<string, School>;
  activeSchool: string;
  getActiveSchool: () => School | null;
  addSchool: (school: School | undefined) => void;
  setActiveSchool: (schoolId: string | null) => void;
}

export const useSchoolStore = create<SchoolState>()(
  devtools(
    persist(
      (set, get) => ({
        schools: {},
        activeSchool: "",
        getActiveSchool: () => get().schools[get().activeSchool] ?? null,
        addSchool: (school) =>
          set((state: SchoolState) => {
            if (!school?.publicId) {
              return state;
            }
            state.schools[school.publicId] = school;
            return state;
          }),
        setActiveSchool: (schoolId) =>
          set((state) => {
            if (!schoolId) {
              return state;
            }
            state.activeSchool = schoolId;
            return state;
          }),
      }),
      {
        name: "school-storage",
      },
    ),
  ),
);
