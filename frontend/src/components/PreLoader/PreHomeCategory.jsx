import { motion } from "framer-motion"

const PreHomeCategory = () => {
    return (
        <div className="grid grid-cols-4 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-1.5 sm:gap-3">
            {Array(10).fill(null).map((_, index) => (
                <motion.div
                    key={index}
                    className="flex flex-col gap-2 rounded-xl bg-white border border-gray-500 hover:border-gray-300 shadow-xs hover:shadow-sm transition-all overflow-hidden cursor-pointer"
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: 0.7 }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                    }}
                >
                    <div className="h-20 sm:h-28 w-full flex items-center justify-center bg-linear-to-b from-purple-200 to-white">

                    </div>
                    <div className="p-2">
                        <div className="h-4 bg-gray-300 rounded-sm w-full mb-1"></div>
                        <div className="h-3 bg-gray-300 rounded-sm w-2/3"></div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

export default PreHomeCategory
