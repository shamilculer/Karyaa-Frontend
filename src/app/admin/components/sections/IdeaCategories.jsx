"use client"
import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Carousel } from "@/components/ui/carousel"
import { Edit2Icon } from "lucide-react"
import { EditIdeaCategoryModal } from "../modals/ideas/EditIdeaCategoryModal"
import { CreateIdeaCategoryModal } from "../modals/ideas/CreateIdeaCategoryModal"
import { getAllIdeaCategoriesAction } from "@/app/actions/public/ideas"

const IdeaCategories = ({ categories: initialCategories }) => {
    const [hoveredId, setHoveredId] = useState(null);
    // 1. State for the categories array (to allow refreshing data)
    const [categories, setCategories] = useState(initialCategories);
    // 2. State for modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 3. State to hold the data of the category being edited
    const [categoryToEdit, setCategoryToEdit] = useState(null);

    // Function to re-fetch the categories list and update state
    const refreshCategories = async () => {
        // You might need a specific role for fetching in your app
        const result = await getAllIdeaCategoriesAction({ role: "admin" });
        if (result.success) {
            setCategories(result.data);
        } else {
            console.error("Failed to refresh categories:", result.message);
            // Optionally show a toast error here
        }
    };

    const handleEditClick = (cat, e) => {
        e.stopPropagation(); // Prevents click events from interfering with the carousel
        setCategoryToEdit(cat);
        setIsModalOpen(true);
    };

    return (
        <div className="w-full flex items-center gap-5 py-6 px-5">
            <div className="w-[85%] relative">
                <Carousel
                    slidesPerView={6}
                    spaceBetween={30}
                    withNavigation
                    withPagination={false}
                >
                    {categories && categories.map((cat) => {
                        const isHovered = hoveredId === cat._id;

                        return (
                            <div
                                key={cat._id}
                                onMouseEnter={() => setHoveredId(cat._id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className="flex flex-col justify-start gap-2 cursor-pointer transition-all duration-200 flex-shrink-0"
                            >
                                <div
                                    className="mx-auto rounded-full overflow-hidden relative"
                                >
                                    <div
                                        className={`absolute top-0 left-0 rounded-full h-full w-full z-10 flex-center transition-all ${isHovered ? 'bg-black/60' : 'bg-black/0'}`}
                                    >
                                        <Button
                                            variant={"ghost"}
                                            // ➡️ New onClick handler to open the modal
                                            onClick={(e) => handleEditClick(cat, e)}
                                            className={`p-2 bg-primary hover:bg-secondary rounded-full text-white h-auto ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                                        >
                                            <Edit2Icon className="w-5 h-5" />
                                        </Button>
                                    </div>
                                    <img
                                        src={cat?.coverImage}
                                        alt={cat.name}
                                        className="object-cover w-full h-full rounded-full aspect-square"
                                    />
                                </div>

                                <h5 className="text-center text-sm">{cat.name}</h5>
                            </div>
                        )
                    })}
                </Carousel>
            </div>

            <div className="w-[15%] flex-center">
                <CreateIdeaCategoryModal onCreationSuccess={refreshCategories} />
            </div>

            {categoryToEdit && (
                <EditIdeaCategoryModal
                    open={isModalOpen}
                    setOpen={setIsModalOpen}
                    category={categoryToEdit}
                    onUpdateSuccess={refreshCategories}
                />
            )}
        </div>
    )
}

export default IdeaCategories