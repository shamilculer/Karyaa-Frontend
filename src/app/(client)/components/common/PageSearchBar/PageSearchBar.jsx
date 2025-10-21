import PageSearchBarClient from "./pageSearchBar.client";

export default function PageSearchBar() {
  const locations = [
    { value: "dubai", label: "Dubai" },
    { value: "abu-dhabi", label: "Abu Dhabi" },
    { value: "sharjah", label: "Sharjah" },
  ];

  return (
    <PageSearchBarClient locations={locations} />
  );
}