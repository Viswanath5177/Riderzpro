import fs from "fs";

let content = fs.readFileSync("src/lib/store.tsx", "utf-8");

// 1. Initial hydration on mount
content = content.replace(
  `fetch("/api/wishlist", { credentials: "include" })
        .then((r) => r.json())
        .then((d) => {
          if (d.success && Array.isArray(d.items)) {
            const ids = Array.from(new Set(d.items.map((it: any) => it.product_id || it.id))) as string[];
            setSavedProductIds(ids);
            setWishlistItems(d.items);
          } else {
            setSavedProductIds([]);
            setWishlistItems([]);
          }
        })`,
  `const emailQuery = s?.userProfile?.email ? \`?email=\${encodeURIComponent(s.userProfile.email)}\` : "";
      fetch(\`/api/wishlist\${emailQuery}\`, { credentials: "include" })
        .then((r) => r.json())
        .then((d) => {
          if (d.success && Array.isArray(d.items)) {
            if (d.items.length > 0 || Boolean(s?.isLoggedIn)) {
              const ids = Array.from(new Set(d.items.map((it: any) => it.product_id || it.id))) as string[];
              setSavedProductIds(ids);
              setWishlistItems(d.items);
            }
          }
        })`
);

// Fallback for CRLF
content = content.replace(
  `fetch("/api/wishlist", { credentials: "include" })\r\n        .then((r) => r.json())\r\n        .then((d) => {\r\n          if (d.success && Array.isArray(d.items)) {\r\n            const ids = Array.from(new Set(d.items.map((it: any) => it.product_id || it.id))) as string[];\r\n            setSavedProductIds(ids);\r\n            setWishlistItems(d.items);\r\n          } else {\r\n            setSavedProductIds([]);\r\n            setWishlistItems([]);\r\n          }\r\n        })`,
  `const emailQuery = s?.userProfile?.email ? \`?email=\${encodeURIComponent(s.userProfile.email)}\` : "";\r\n      fetch(\`/api/wishlist\${emailQuery}\`, { credentials: "include" })\r\n        .then((r) => r.json())\r\n        .then((d) => {\r\n          if (d.success && Array.isArray(d.items)) {\r\n            if (d.items.length > 0 || Boolean(s?.isLoggedIn)) {\r\n              const ids = Array.from(new Set(d.items.map((it: any) => it.product_id || it.id))) as string[];\r\n              setSavedProductIds(ids);\r\n              setWishlistItems(d.items);\r\n            }\r\n          }\r\n        })`
);

// 2. fetchWishlist function
content = content.replace(
  `  const fetchWishlist = useCallback(async () => {
    setIsLoadingWishlist(true);
    setWishlistError(null);
    try {
      const res = await fetch("/api/wishlist", { credentials: "include" });
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        const ids = Array.from(new Set(data.items.map((it: any) => it.product_id || it.id))) as string[];
        setSavedProductIds(ids);
        setWishlistItems(data.items);
      } else {
        setSavedProductIds([]);
        setWishlistItems([]);
      }
    } catch (err: any) {
      console.error("[fetchWishlist Error]:", err);
      setWishlistError(err?.message || "Failed to load wishlist");
    } finally {
      setIsLoadingWishlist(false);
    }
  }, []);`,
  `  const fetchWishlist = useCallback(async () => {
    setIsLoadingWishlist(true);
    setWishlistError(null);
    try {
      const emailQuery = userProfile?.email ? \`?email=\${encodeURIComponent(userProfile.email)}\` : "";
      const res = await fetch(\`/api/wishlist\${emailQuery}\`, { credentials: "include" });
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        if (data.items.length > 0 || isLoggedIn) {
          const ids = Array.from(new Set(data.items.map((it: any) => it.product_id || it.id))) as string[];
          setSavedProductIds(ids);
          setWishlistItems(data.items);
        }
      }
    } catch (err: any) {
      console.error("[fetchWishlist Error]:", err);
      setWishlistError(err?.message || "Failed to load wishlist");
    } finally {
      setIsLoadingWishlist(false);
    }
  }, [userProfile?.email, isLoggedIn]);`
);

content = content.replace(
  `  const fetchWishlist = useCallback(async () => {\r\n    setIsLoadingWishlist(true);\r\n    setWishlistError(null);\r\n    try {\r\n      const res = await fetch("/api/wishlist", { credentials: "include" });\r\n      const data = await res.json();\r\n      if (data.success && Array.isArray(data.items)) {\r\n        const ids = Array.from(new Set(data.items.map((it: any) => it.product_id || it.id))) as string[];\r\n        setSavedProductIds(ids);\r\n        setWishlistItems(data.items);\r\n      } else {\r\n        setSavedProductIds([]);\r\n        setWishlistItems([]);\r\n      }\r\n    } catch (err: any) {\r\n      console.error("[fetchWishlist Error]:", err);\r\n      setWishlistError(err?.message || "Failed to load wishlist");\r\n    } finally {\r\n      setIsLoadingWishlist(false);\r\n    }\r\n  }, []);`,
  `  const fetchWishlist = useCallback(async () => {\r\n    setIsLoadingWishlist(true);\r\n    setWishlistError(null);\r\n    try {\r\n      const emailQuery = userProfile?.email ? \`?email=\${encodeURIComponent(userProfile.email)}\` : "";\r\n      const res = await fetch(\`/api/wishlist\${emailQuery}\`, { credentials: "include" });\r\n      const data = await res.json();\r\n      if (data.success && Array.isArray(data.items)) {\r\n        if (data.items.length > 0 || isLoggedIn) {\r\n          const ids = Array.from(new Set(data.items.map((it: any) => it.product_id || it.id))) as string[];\r\n          setSavedProductIds(ids);\r\n          setWishlistItems(data.items);\r\n        }\r\n      }\r\n    } catch (err: any) {\r\n      console.error("[fetchWishlist Error]:", err);\r\n      setWishlistError(err?.message || "Failed to load wishlist");\r\n    } finally {\r\n      setIsLoadingWishlist(false);\r\n    }\r\n  }, [userProfile?.email, isLoggedIn]);`
);

// 3. toggleSaved fetch body
content = content.replace(
  `body: JSON.stringify({ product_id: id, action: alreadySaved ? "remove" : "add" }),`,
  `body: JSON.stringify({
          product_id: id,
          action: alreadySaved ? "remove" : "add",
          email: userProfile?.email || undefined,
          customer_id: userProfile?.email || undefined,
        }),`
);

fs.writeFileSync("src/lib/store.tsx", content);
console.log("Successfully updated store.tsx wishlist logic!");
