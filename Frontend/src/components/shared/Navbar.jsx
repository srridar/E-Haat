import React from 'react'
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";


const Navbar = () => {
  return (
    <header className='sticky top-0 z-50 w-full bg-background border-b'>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between  px-4">
        <Link to="/" className="text-2xl font-bold text-primary">
          <img src="logo.png" alt="e-haat" className='rounded-full h-[65px] w-[75px]' />
        </Link>

        <div className="flex gap-12 justify-center items-center">
          <nav className='gap-8 flex  mx-auto font-normal'>
            <Link to="/" className="text-dark hover:text-primary ">
              Home
            </Link>
            <Link to="/farmers" className="text-dark hover:text-primary">
              Farmers
            </Link>
            <Link to="/products" className="text-dark hover:text-primary">
              Products
            </Link>
            <Link to="/about" className="text-dark hover:text-primary">
              About
            </Link>
          </nav>

          <div className="flex justify-center items-center">
            <input type="text" placeholder='Search' className='border-gray-500 border h-[30px] p-2 ' />
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline">Login</Button>
            <Button className="bg-secondary text-white hover:bg-secondary/90">
              Register
            </Button>
          </div>
        </div>



        {/* i need to manually implement this section */}
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Menu className="h-6 w-6" />
          </SheetTrigger>

          <SheetContent side="right">
            <div className="flex flex-col gap-6 mt-6">
              <Link to="/" className="text-lg">Home</Link>
              <Link to="/farmers" className="text-lg">Farmers</Link>
              <Link to="/products" className="text-lg">Products</Link>
              <Link to="/about" className="text-lg">About</Link>

              <div className="flex flex-col gap-3 pt-4">
                <Button variant="outline">Login</Button>
                <Button className="bg-secondary text-white">
                  Register
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header >
  )
}

export default Navbar