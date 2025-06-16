import { motion } from 'framer-motion';
import { FiMinus, FiPlus } from 'react-icons/fi';

const CartItemList = ({
    items,
    updatingItemId,
    onDecreaseQuantity,
    onIncreaseQuantity,
    getPriceAfterDiscount
}) => {
    return (
        <div className='bg-purple-50 py-2 px-1.5'>
            {items.map(item => (
                <div
                    key={item._id}
                    className="flex gap-3 items-center pt-1.5 pb-2.5 px-2 pr-3 bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative"
                >
                    {updatingItemId === item._id && (
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-purple-600 rounded-full"
                                initial={{ x: '-100%' }}
                                animate={{
                                    x: ['-100%', '100%', '-100%'],
                                    transition: {
                                        repeat: Infinity,
                                        duration: 3,
                                        ease: "easeInOut"
                                    }
                                }}
                            />
                        </div>
                    )}

                    {/* Product image */}
                    <div className="flex-shrink-0">
                        <img
                            src={item.productId.images[0]}
                            alt={item.productId.name}
                            className="w-14 h-14 object-contain rounded-md"
                        />
                    </div>

                    {/* Product info and quantity controls */}
                    <div className="flex-grow">
                        <p className="font-medium text-sm text-gray-800 line-clamp-2">
                            {item.productId.name}
                        </p>

                        <div className="flex items-center mt-2">
                            <button
                                onClick={(e) => onDecreaseQuantity(e, item)}
                                className={`cursor-pointer w-6 h-6 flex items-center justify-center border border-purple-300 rounded-full transition-colors duration-200 active:scale-95 ${updatingItemId
                                    ? 'bg-gray-100 text-gray-400'
                                    : 'hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700'
                                    }`}
                                disabled={!!updatingItemId}
                                aria-label="Decrease quantity"
                            >
                                <FiMinus className="text-sm" />
                            </button>
                            <span className="mx-1.5 text-base font-medium text-gray-800 min-w-[24px] text-center">
                                {item.quantity}
                            </span>
                            <button
                                onClick={(e) => onIncreaseQuantity(e, item)}
                                className={`cursor-pointer w-6 h-6 flex items-center justify-center border border-purple-300 rounded-full transition-colors duration-200 active:scale-95 ${updatingItemId
                                    ? 'bg-gray-100 text-gray-400'
                                    : 'hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700'
                                    }`}
                                disabled={!!updatingItemId}
                                aria-label="Increase quantity"
                            >
                                <FiPlus className="text-sm" />
                            </button>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex-shrink-0 text-right">
                        <p className="text-sm sm:text-base font-semibold text-black">
                            ₹{(getPriceAfterDiscount(item.productId.price, item.productId.discount) * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-600 line-through">
                            ₹{(item.productId.price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CartItemList;