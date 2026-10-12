import React from "react";
import Link from "next/link";

interface ButtonPropTypes {
  label: string;
  link?: string;
  customClasses: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const ButtonDefault: React.FC<ButtonPropTypes> = ({
  label,
  link,
  customClasses,
  children,
  onClick,
}) => {
  const buttonContent = (
    <>
      {children}
      {label}
    </>
  );

  const buttonClasses = `inline-flex items-center justify-center gap-2.5 text-center font-medium hover:bg-opacity-90 ${customClasses}`;

  if (link) {
    return (
      <Link className={buttonClasses} href={link}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button type="button" className={buttonClasses} onClick={onClick}>
      {buttonContent}
    </button>
  );
};

export default ButtonDefault;