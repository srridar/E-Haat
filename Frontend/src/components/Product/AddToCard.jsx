import { useCart } from './CartContext';

const AddToCard = ({ product }) => {
  const { product._id, product.name, product.price, total, product.stock } = product;

  const [amount , setAmount] = useState(1);
  const subTotal = amount * product.price;

  const setIncrease = () => {
     amount < product.stock && setAmount(amount + 1);
  }

  const setDecrease = () => {
    amount > 1 ? setAmount(amount - 1) : setAmount(0);
  }

  const { cartCount } = useCart();

  return (
    <div className="relative group cursor-pointer p-2 transition-colors hover:bg-gray-50 rounded-full">
      {/* The SVG Logo */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6 text-gray-700 group-hover:text-gray-900" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
        />
      </svg>


      {cartCount > 0 && (
        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white animate-in zoom-in duration-300">
          {cartCount}
        </span>
      )}
    </div>
  );
};


export default AddToCard;