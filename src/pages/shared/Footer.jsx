import React from "react";
import { Link } from "react-router";
import {
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaBox,
  FaArrowRight,
} from "react-icons/fa";
import QuickLogo from "./QuickLogo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">

        {/* Brand */}
        <div>
          <Link to="/" className="inline-block">
            <QuickLogo />
          </Link>

          <p className="mt-4 max-w-xs text-sm leading-7 text-neutral-content/75">
            Your parcels, our priority. Quick makes parcel delivery simple,
            secure, and convenient for individuals and businesses.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-base-100/10 transition hover:bg-primary hover:text-primary-content"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-base-100/10 transition hover:bg-primary hover:text-primary-content"
            >
              <FaYoutube />
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-base-100/10 transition hover:bg-primary hover:text-primary-content"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 text-lg font-bold">Quick Links</h3>

          <ul className="space-y-3 text-sm text-neutral-content/75">
            <li>
              <Link to="/" className="transition hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition hover:text-primary">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/coverage" className="transition hover:text-primary">
                Coverage
              </Link>
            </li>
            <li>
              <Link to="/sendParcel" className="transition hover:text-primary">
                Send a Parcel
              </Link>
            </li>
            <li>
              <Link to="/beARider" className="transition hover:text-primary">
                Become a Rider
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-5 text-lg font-bold">Our Services</h3>

          <ul className="space-y-3 text-sm text-neutral-content/75">
            <li className="flex items-center gap-2">
              <FaBox className="text-primary" />
              Parcel Delivery
            </li>
            <li className="flex items-center gap-2">
              <FaBox className="text-primary" />
              E-commerce Delivery
            </li>
            <li className="flex items-center gap-2">
              <FaBox className="text-primary" />
              Business Parcel Solutions
            </li>
            <li>
              <Link
                to="/coverage"
                className="inline-flex items-center gap-2 transition hover:text-primary"
              >
                Explore Coverage <FaArrowRight />
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-lg font-bold">Get in Touch</h3>

          <ul className="space-y-4 text-sm text-neutral-content/75">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 shrink-0 text-primary" />
              <span>Bangladesh</span>
            </li>

            <li className="flex items-start gap-3">
              <FaEnvelope className="mt-1 shrink-0 text-primary" />
              <a
                href="mailto:support@quick.com"
                className="break-all transition hover:text-primary"
              >
                support@quick.com
              </a>
            </li>

            <li className="flex items-start gap-3">
              <FaPhoneAlt className="mt-1 shrink-0 text-primary" />
              <a
                href="tel:+8801000000000"
                className="transition hover:text-primary"
              >
                +880 1000-000000
              </a>
            </li>
          </ul>

          <p className="mt-4 text-xs text-neutral-content/60">
            Contact details can be updated with your official support
            information.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-content/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-center text-sm text-neutral-content/65 sm:flex-row lg:px-8">
          <p>
            © {currentYear} Quick Parcel Delivery. All rights reserved.
          </p>

          <Link
            to="/"
            className="transition hover:text-primary"
          >
            Fast, Safe & Reliable Delivery
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;