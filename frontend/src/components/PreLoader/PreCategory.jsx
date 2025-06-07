import React from "react";
import { motion } from "framer-motion";

const PreCategory = ({ items = 10 }) => {

    const shimmerAnimation = {
        initial: { backgroundPosition: '-200% 0' },
        animate: {
            backgroundPosition: ['-200% 0', '200% 0'],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };


    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0,
                staggerChildren: 0.1,
                ease: "easeOut"
            }
        }
    };


    const cardVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {[...Array(items)].map((_, index) => (
                <motion.div
                    key={index}
                    className="relative border border-gray-300 bg-white rounded-lg overflow-hidden flex flex-col"
                    variants={cardVariants}
                >

                    <div className="relative pt-[56.25%] bg-gray-200 overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]"
                            initial="initial"
                            animate="animate"
                            variants={shimmerAnimation}
                            style={{ backgroundSize: '200% 100%' }}
                        />
                    </div>


                    <div className="p-3 space-y-2">

                        <motion.div
                            className="h-4 rounded bg-gray-200 w-full"
                            initial="initial"
                            animate="animate"
                            variants={shimmerAnimation}
                            style={{ backgroundSize: '200% 100%' }}
                        />


                        <motion.div
                            className="h-5 rounded bg-gray-200 w-3/4 mt-2"
                            initial="initial"
                            animate="animate"
                            variants={shimmerAnimation}
                            style={{ backgroundSize: '200% 100%' }}
                        />

                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default PreCategory;