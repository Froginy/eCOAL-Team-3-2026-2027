import { useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useRef } from "react";

function UserAvatar({
  src,
  name = "",
  size = 32,
  showName = false,
  to = "/settings",
  className = "",
  hover = true,
}) {
  const [imgError, setImgError] = useState(false);
  const containerRef = useRef(null);

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  let handleMouseEnter, handleMouseLeave;
  if (hover) {
    handleMouseEnter = () => {
      if (!containerRef.current) return;
      gsap.to(containerRef.current, { scale: 1.08, duration: 0.25, ease: "back.out(2)" });
    };
    handleMouseLeave = () => {
      if (!containerRef.current) return;
      gsap.to(containerRef.current, { scale: 1, duration: 0.2, ease: "power2.out" });
    };
  }

  const showImage = src && !imgError;

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: "50%",
    flexShrink: 0,
    overflow: "hidden",
    background: showImage ? "transparent" : "black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: Math.max(10, size * 0.38),
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.01em",
    userSelect: "none",
  };

  const sharedProps = {
    ref: containerRef,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    className: `flex items-center gap-2 no-underline ${className}`,
    style: { textDecoration: "none", color: "inherit",
    cursor: hover ? "pointer" : "default" },
  };

  const content = (
    <>
      <div style={avatarStyle}>
        {showImage ? (
          <img
            src={src}
            alt={name}
            onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <span>{initials || "?"}</span>
        )}
      </div>
      {showName && name && (
        <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 90 }}>
          {name.split(" ")[0]}
        </span>
      )}
    </>
  );

  if (!to) return <div {...sharedProps}>{content}</div>;
  return <Link to={to} {...sharedProps}>{content}</Link>;
}

export default UserAvatar;
