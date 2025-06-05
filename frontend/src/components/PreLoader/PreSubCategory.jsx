import React from "react";
import { motion } from "framer-motion";

const PreSubCategory = ({ rows = 5 }) => {
    // Breathing animation variants
    const waveVariants = {
        initial: { opacity: 0.5, x: -20 },
        animate: {
            opacity: 0.8,
            x: 0,
            transition: {
                duration: 1.2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
            }
        }
    };

    // Row animation
    const rowVariants = {
        hidden: { opacity: 0 },
        visible: (i) => ({
            opacity: 1,
            transition: {
                delay: i * 0.1,
                duration: 0.5
            }
        })
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-x-scroll">
                <thead className="bg-purple-200 border">
                    <tr>
                        <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold text-black w-40">Image</th>
                        <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold text-black w-52">Name</th>
                        <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold text-black min-w-60">Categories</th>
                        <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold text-black max-w-32 sm:min-w-60">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {[...Array(rows)].map((_, index) => (
                        <motion.tr
                            key={index}
                            className="border hover:bg-purple-50"
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={rowVariants}
                        >
                            {/* Image Column */}
                            <td className="py-4 px-4">
                                <div className="flex items-center">
                                    <motion.div
                                        className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gradient-to-r from-purple-200 via-blue-300 to-gray-300"
                                        variants={waveVariants}
                                        initial="initial"
                                        animate="animate"
                                        style={{
                                            backgroundSize: "200% 100%",
                                        }}
                                    />
                                </div>
                            </td>

                            {/* Name Column */}
                            <td className="py-4 px-4">
                                <motion.div
                                    className="h-6 rounded bg-gradient-to-r from-purple-200 via-blue-300 to-gray-300"
                                    variants={waveVariants}
                                    initial="initial"
                                    animate="animate"
                                    style={{
                                        width: `${70 + (index % 3) * 10}%`,
                                        backgroundSize: "200% 100%",
                                    }}
                                />
                            </td>

                            {/* Categories Column */}
                            <td className="py-4 px-4">
                                <div className="flex flex-wrap gap-2">
                                    {[...Array(3)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="h-6 rounded-full bg-gradient-to-r from-purple-200 via-blue-300 to-gray-300"
                                            variants={waveVariants}
                                            initial="initial"
                                            animate="animate"
                                            style={{
                                                width: `${60 + (i % 3) * 15}px`,
                                                backgroundSize: "200% 100%",
                                            }}
                                        />
                                    ))}
                                </div>
                            </td>

                            {/* Actions Column */}
                            <td className="py-4 px-4 w-24">
                                <div className="flex items-center justify-center space-x-3">
                                    <motion.div
                                        className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-200 via-blue-300 to-gray-300"
                                        variants={waveVariants}
                                        initial="initial"
                                        animate="animate"
                                        style={{
                                            backgroundSize: "200% 100%",
                                        }}
                                    />
                                    <motion.div
                                        className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-200 via-blue-300 to-gray-300"
                                        variants={waveVariants}
                                        initial="initial"
                                        animate="animate"
                                        style={{
                                            backgroundSize: "200% 100%",
                                            animationDelay: "0.3s",
                                        }}
                                    />
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PreSubCategory;