
import { FiShoppingCart } from "react-icons/fi";
import { FaMotorcycle } from "react-icons/fa";

const PreProduct = ({ Length }) => {
    return (
        Array(Length).fill(null).map((_, index) => (
            <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-purple-200 animate-pulse"
            >
                {/* Product Image Skeleton */}
                <div className="relative h-40 w-full border-b border-gray-200 bg-purple-100 animate-pulse"></div>

                {/* Product Info Skeleton */}
                <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-3 w-3/4 bg-gray-200 rounded mb-3 animate-pulse"></div>

                    <div className="w-fit py-0.5 px-2 rounded-2xl flex items-center text-xs text-purple-300 border mb-2 animate-pulse">
                        <FaMotorcycle className="mr-1" size={12} />
                        <span>Get in -- min</span>
                    </div>

                    <div className="flex flex-col items-center justify-between">

                        <div className="w-full bg-purple-200 text-gray-500 text-[13px] px-3 py-1.5 rounded-lg flex items-center justify-center animate-pulse">
                            <FiShoppingCart className="mr-1" size={12} />
                            Add
                        </div>
                    </div>
                </div>
            </div>
        ))
    )
}

export default PreProduct
