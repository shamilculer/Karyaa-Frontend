import PageSearchBarClient from "./pageSearchBar.client";

export default function PageSearchBar() {
  const locations = [
    { value: "abu-dhabi", label: "Abu Dhabi" },
    { value: "dubai", label: "Dubai" },
    { value: "sharjah", label: "Sharjah" },
    { value: "ajman", label: "Ajman" },
    { value: "umm-al-quwain", label: "Umm Al Quwain" },
    { value: "ras-al-khaimah", label: "Ras Al Khaimah" },
    { value: "fujairah", label: "Fujairah" },
];

  return (
    <PageSearchBarClient locations={locations} />
  );
}