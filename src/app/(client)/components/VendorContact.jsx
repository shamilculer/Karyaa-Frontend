import {
    Avatar,
    AvatarImage,
    AvatarFallback
} from "@/components/ui/avatar"
import VendorForm from "./VendorForm"

const VendorContact = ({
    vendorName,
    OwnerName,
    ContactDesc,
}) => {
    return (
        <div className="w-full p-6 bg-white border border-[#CACCD0] space-y-7">
            <div>
                <h4 className="uppercase text-xl">Start the COnvo</h4>
                <div className="text-sm">Use this secure form to reach out and share your wedding vision.</div>
            </div>

            <div>
                <div className="flex items-center gap-5">
                    <Avatar className="size-20 rounded-full overflow-hidden border border-gray-200">
                        <AvatarImage className="size-full object-cover" src="/owner.png" />
                        <AvatarFallback>OWR</AvatarFallback>
                    </Avatar>

                    <div className="">
                        <span className="font-heading font-medium">{vendorName}</span>
                        <div className="text-sm">
                            Nora Khuder | Owner
                        </div>
                        <p>Typically responds within 24h</p>
                    </div>
                </div>
            </div>

            <div>
                <VendorForm />
            </div>
        </div>
    )
}

export default VendorContact
