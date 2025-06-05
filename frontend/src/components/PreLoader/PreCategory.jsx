import React from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";

const PreCategory = ({ items = 10 }) => {
    // Subtle glowing pulse (brighter + soft scaling)
    const cardGlow = {
        initial: { opacity: 0.75, scale: 0.98 },
        animate: {
            opacity: [0.75, 1, 0.85],
            scale: [0.98, 1, 0.99],
            transition: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
            }
        }
    };

    // Gentle floating effect (adds horizontal shift for natural feel)
    const floatAnimation = {
        initial: { y: 0, x: 0 },
        animate: {
            y: [-2, -4, -2],
            x: [0, 1, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
            }
        }
    };

    // More natural pulsing effect
    const pulseAnimation = {
        initial: { scale: 1 },
        animate: {
            scale: [1, 1.04, 0.98, 1],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    // Refined staggered entry for container
    const containerVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.15,
                ease: "easeOut"
            }
        }
    };

    // Snappier child item entry
    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "anticipate"
            }
        }
    };


    return (
        <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {[...Array(items)].map((_, index) => (
                <motion.div
                    key={index}
                    className="relative bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-all"
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                >
                    {/* Animated image placeholder */}
                    <motion.div
                        className="relative flex-grow h-40 border bg-gradient-to-br from-gray-400 to-gray-200 border-b border-gray-200"
                        variants={floatAnimation}
                        initial="initial"
                        animate="animate"
                    >
                        <motion.div
                            className="absolute inset-0 bg-white/30"
                            variants={cardGlow}
                            initial="initial"
                            animate="animate"
                        />
                    </motion.div>

                    {/* Content section */}
                    <motion.div
                        className="p-3 flex flex-col gap-3"
                        variants={pulseAnimation}
                        initial="initial"
                        animate="animate"
                    >
                        {/* Title placeholder */}
                        <motion.div
                            className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"
                            style={{ width: `${70 + (index % 3) * 10}%` }}
                        />

                        {/* Button placeholder */}
                        <motion.div
                            className="w-full h-9 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >

                        </motion.div>
                    </motion.div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default PreCategory;