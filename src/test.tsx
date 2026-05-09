// import React from "react";
// import { useAuth }    from "./context/auth";
// import { useUser }    from "./context/user";
// import { useRole }    from "./context/role";
// import { useProfile } from "./context/profile";
// import { useCart }    from "./context/cart";
// import { RoleName } from "./entity/role";
// import { Permission } from "./entity/permission";

// // ─────────────────────────────────────────────────────────────────────────────
// // 1. AUTH CONTEXT — useAuth()
// //    signIn, signOut, isLoggedIn, isLoading
// // ─────────────────────────────────────────────────────────────────────────────

// export const LoginPage: React.FC = () => {
//   const { signIn, isLoggedIn, isLoading } = useAuth();

//   const handleLogin = async () => {
//     // Replace with your actual API call
//     const response = await fetch("/api/auth/login", {
//       method: "POST",
//       body: JSON.stringify({ email: "user@mail.com", password: "pass123" }),
//     }).then((r) => r.json());

//     // Pass all entities returned from API into signIn
//     // This saves to localStorage AND populates all contexts at once
//     await signIn({
//       token:   response.token,
//       user:    response.user,
//       role:    response.role,
//       profile: response.profile,
//       cart:    response.cart,   // optional
//     });
//   };

//   // isLoading is true only during the initial rehydration on page refresh
//   // Use it to avoid flashing the login page when user is already logged in
//   if (isLoading) return <div>Loading...</div>;

//   if (isLoggedIn) return <div>Already logged in!</div>;

//   return <button onClick={handleLogin}>Login</button>;
// };


// export const LogoutButton: React.FC = () => {
//   const { signOut } = useAuth();

//   // signOut clears all contexts AND removes all keys from localStorage
//   return <button onClick={signOut}>Logout</button>;
// };


// // Protect routes — show children only if logged in
// export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isLoggedIn, isLoading } = useAuth();

//   if (isLoading)   return <div>Loading...</div>;
//   if (!isLoggedIn) return <div>Please log in to continue.</div>;

//   return <>{children}</>;
// };


// // ─────────────────────────────────────────────────────────────────────────────
// // 2. USER CONTEXT — useUser()
// //    user, setUser, clearUser
// // ─────────────────────────────────────────────────────────────────────────────

// export const UserInfoBanner: React.FC = () => {
//   const { user } = useUser();

//   if (!user) return null;

//   return (
//     <div>
//       <p>User ID: {user.id}</p>
//       <p>Roles assigned: {user.roles?.map((r) => r.name).join(", ")}</p>
//     </div>
//   );
// };


// // Update user data after an API call (e.g. user updated their email)
// export const UpdateUserExample: React.FC = () => {
//   const { user, setUser } = useUser();

//   const handleRefreshUser = async () => {
//     const updated = await fetch(`/api/users/${user?.id}`).then((r) => r.json());
//     setUser(updated); // updates context; does NOT auto-save to localStorage
//   };

//   return <button onClick={handleRefreshUser}>Refresh User</button>;
// };


// // ─────────────────────────────────────────────────────────────────────────────
// // 3. ROLE CONTEXT — useRole()
// //    role, setRole, clearRole, hasPermission()
// // ─────────────────────────────────────────────────────────────────────────────

// // Show/hide UI elements based on role name
// export const AdminOnlyPanel: React.FC = () => {
//   const { role } = useRole();

//   if (role?.name !== RoleName.ADMIN && role?.name !== RoleName.SUPER_ADMIN) {
//     return null; // hides the panel entirely for non-admins
//   }

//   return <div>Admin Panel — only visible to admins</div>;
// };


// // Show/hide UI elements based on specific permission
// export const CreateProductButton: React.FC = () => {
//   const { hasPermission } = useRole();

//   // hasPermission checks if role.permissions includes the given permission
//   if (!hasPermission(Permission.PRODUCT_WRITE)) {
//     return null; // customers and read-only roles won't see this
//   }

//   return <button>+ Create Product</button>;
// };


// // Render different UI for different roles
// export const DashboardHeader: React.FC = () => {
//   const { role } = useRole();

//   const headerMap: Partial<Record<RoleName, string>> = {
//     [RoleName.SUPERADMIN]:     "Super Admin Dashboard",
//     [RoleName.ADMIN]:           "Admin Dashboard",
//     // [RoleName.MANAGER]:         "Manager Dashboard",
//     // [RoleName.WAREHOUSE_STAFF]: "Warehouse Dashboard",
//     [RoleName.CUSTOMER]:        "My Account",
//   };

//   return <h1>{role?.name ? headerMap[role.name] ?? "Dashboard" : "Dashboard"}</h1>;
// };


// // Conditionally disable a button based on permission
// export const DeleteOrderButton: React.FC<{ orderId: string }> = ({ orderId }) => {
//   const { hasPermission } = useRole();
//   const canDelete = hasPermission(
//     // Permission.ORDER_WRITE
// );

//   return (
//     <button
//       disabled={!canDelete}
//       onClick={() => console.log("Delete order", orderId)}
//       title={!canDelete ? "You don't have permission to delete orders" : ""}
//     >
//       Delete Order
//     </button>
//   );
// };


// // ─────────────────────────────────────────────────────────────────────────────
// // 4. PROFILE CONTEXT — useProfile()
// //    profile, setProfile, updateProfile, clearProfile
// // ─────────────────────────────────────────────────────────────────────────────

// // Display profile info in a navbar avatar
// export const NavbarAvatar: React.FC = () => {
//   const { profile } = useProfile();

//   if (!profile) return null;

//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//       {profile.profilePic
//         ? <img src={profile.profilePic} alt="avatar" style={{ width: 36, height: 36, borderRadius: "50%" }} />
//         : <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#ccc" }} />
//       }
//       <span>{profile.name}</span>
//       {!profile.isEmailVerified && (
//         <span style={{ color: "red", fontSize: 12 }}>Email not verified</span>
//       )}
//     </div>
//   );
// };


// // Edit profile form — uses updateProfile to merge only changed fields
// export const EditProfileForm: React.FC = () => {
//   const { profile, updateProfile } = useProfile();
//   const [name, setName] = React.useState(profile?.name ?? "");
//   const [mobile, setMobile] = React.useState(profile?.mobile ?? "");

//   const handleSave = async () => {
//     // Call your API first
//     await fetch(`/api/profile/${profile?.id}`, {
//       method: "PATCH",
//       body: JSON.stringify({ name, mobile }),
//     });

//     // Then merge only the changed fields into context
//     // Other fields like profilePic, email etc. stay untouched
//     updateProfile({ name, mobile });
//   };

//   return (
//     <div>
//       <input value={name}   onChange={(e) => setName(e.target.value)}   placeholder="Name" />
//       <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile" />
//       <button onClick={handleSave}>Save</button>
//     </div>
//   );
// };


// // Replace entire profile (e.g. after re-fetching from API)
// export const RefreshProfileExample: React.FC = () => {
//   const { profile, setProfile } = useProfile();

//   const handleRefresh = async () => {
//     const fresh = await fetch(`/api/profile/${profile?.id}`).then((r) => r.json());
//     setProfile(fresh); // replaces the whole profile object
//   };

//   return <button onClick={handleRefresh}>Refresh Profile</button>;
// };


// // ─────────────────────────────────────────────────────────────────────────────
// // 5. CART CONTEXT — useCart()
// //    cart, setCart, addToCart, removeFromCart, updateQuantity,
// //    applyPromocode, removePromocode, clearCart, totalItems, totalPrice
// // ─────────────────────────────────────────────────────────────────────────────

// // Cart icon in navbar showing item count badge
// export const CartNavIcon: React.FC = () => {
//   const { totalItems } = useCart();

//   return (
//     <div style={{ position: "relative", display: "inline-flex" }}>
//       🛒
//       {totalItems > 0 && (
//         <span style={{
//           position: "absolute", top: -6, right: -6,
//           background: "red", color: "#fff",
//           borderRadius: "50%", fontSize: 11,
//           width: 18, height: 18,
//           display: "flex", alignItems: "center", justifyContent: "center",
//         }}>
//           {totalItems > 99 ? "99+" : totalItems}
//         </span>
//       )}
//     </div>
//   );
// };


// // Product card — add to cart button
// export const ProductCard: React.FC<{ product: any; variant?: any }> = ({ product, variant }) => {
//   const { addToCart } = useCart();

//   const handleAddToCart = () => {
//     addToCart({
//       id:       `${product.id}_${variant?.id ?? "default"}`,  // unique cart item id
//       product,
//       variant,  // optional — pass if product has variants
//       quantity: 1,
//     });
//   };

//   return (
//     <div>
//       <p>{product.name}</p>
//       <button onClick={handleAddToCart}>Add to Cart</button>
//     </div>
//   );
// };


// // Cart page — list items, update qty, remove
// export const CartPage: React.FC = () => {
//   const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

//   if (!cart?.cartItems?.length) return <p>Your cart is empty.</p>;

//   return (
//     <div>
//       <h2>Cart ({totalItems} items)</h2>

//       {cart.cartItems.map((item) => (
//         <div key={item.id} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
//           <img src={item.product?.images[0]} alt={item.product?.name} width={60} />
//           <div>
//             <p>{item.product?.name}</p>
//             {item.variant && <p style={{ fontSize: 12, color: "#888" }}>{item.variant.name}</p>}
//             <p>₹{(item.variant?.price ?? item.product?.price ?? 0) * (item.quantity ?? 1)}</p>
//           </div>

//           {/* Quantity controls */}
//           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <button onClick={() => updateQuantity(item.id!, (item.quantity ?? 1) - 1)}>−</button>
//             <span>{item.quantity}</span>
//             <button onClick={() => updateQuantity(item.id!, (item.quantity ?? 1) + 1)}>+</button>
//           </div>

//           {/* Remove — updateQuantity(id, 0) also removes */}
//           <button onClick={() => removeFromCart(item.id!)}>Remove</button>
//         </div>
//       ))}

//       <hr />
//       <p><strong>Total: ₹{totalPrice.toFixed(2)}</strong></p>
//     </div>
//   );
// };


// // Promocode input
// export const PromocodeInput: React.FC = () => {
//   const { cart, applyPromocode, removePromocode } = useCart();
//   const [code, setCode] = React.useState("");

//   const handleApply = () => {
//     if (code.trim()) applyPromocode(code.trim());
//   };

//   return (
//     <div>
//       {cart?.appliedPromocode ? (
//         <div>
//           <span>Promo applied: <strong>{cart.appliedPromocode}</strong></span>
//           <button onClick={removePromocode}>Remove</button>
//         </div>
//       ) : (
//         <div>
//           <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter promocode" />
//           <button onClick={handleApply}>Apply</button>
//         </div>
//       )}
//     </div>
//   );
// };


// // Clear cart after successful order placement
// export const OrderSuccessPage: React.FC = () => {
//   const { clearCart } = useCart();

//   React.useEffect(() => {
//     clearCart(); // wipe cart once order is confirmed
//   }, []);

//   return <h2>Order placed successfully! 🎉</h2>;
// };


// // Load cart from API and set it (e.g. on login when cart lives on server)
// export const LoadServerCart: React.FC = () => {
//   const { setCart } = useCart();
//   const { user } = useUser();

//   React.useEffect(() => {
//     if (!user?.id) return;
//     fetch(`/api/cart/${user.id}`)
//       .then((r) => r.json())
//       .then((serverCart) => setCart(serverCart));
//   }, [user?.id]);

//   return null; // invisible loader component
// // };

// const { wishlist, addToWishlist, removeFromWishlist, isInWishlist, totalWishlistItems } = useWishlist();

// // Product card — toggle wishlist
// const handleWishlist = () => {
//   if (isInWishlist(product.id!, variant?.id)) {
//     const entry = wishlist.find(w => w.product?.id === product.id);
//     removeFromWishlist(entry!.id!);
//   } else {
//     addToWishlist({ id: 'w1', product, variant, createdAt: new Date() });
//   }
// };

// <button onClick={handleWishlist}>
//   {isInWishlist(product.id!) ? '❤️ Wishlisted' : '🤍 Add to Wishlist'}
// </button>

// // Wishlist count badge on nav icon (same as cart)
// <IconButton icon={<FiHeart />} badge={totalWishlistItems} />

// // Load from server after login
// const { setWishlist } = useWishlist();
// const serverWishlist = await fetch(`/api/wishlist/${user.id}`).then(r => r.json());
// setWishlist(serverWishlist);