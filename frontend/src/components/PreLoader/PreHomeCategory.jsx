import { motion } from "framer-motion"

const PreHomeCategory = () => {
    return (
        <div className="grid grid-cols-4 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-1.5 sm:gap-3">
            {Array(10).fill(null).map((_, index) => (
                <div key={index} className="flex flex-col h-full">
                    <motion.div
                        className="flex flex-col rounded-lg bg-white shadow-xs hover:shadow-sm transition-all cursor-pointer h-full"
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: 0.7 }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                        }}
                    >
                        {/* Image Container - Fixed Square Aspect Ratio */}
                        <div className="aspect-square w-full flex items-center justify-center rounded-b-2xl bg-gradient-to-b from-purple-100 to-white overflow-hidden">
                            <div className="w-full h-full max-w-[90%] max-h-[100%] bg-purple-200 rounded-lg"></div>
                        </div>

                        {/* Text Container */}
                        <div className="px-1 py-1 min-h-[40px] flex items-center justify-center">
                            <div className="w-full">
                                <div className="h-3 bg-purple-200 rounded-sm w-full mb-1"></div>
                                <div className="h-3 bg-purple-200 rounded-sm w-3/4 "></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            ))}
        </div>
    )
}

export default PreHomeCategory
