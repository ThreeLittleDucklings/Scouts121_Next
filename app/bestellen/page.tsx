"use client";

import { useEffect, useMemo, useState } from "react";
import { STRAPI_URL } from "@/lib/config";

const BANK_ACCOUNT = "BE63 7360 1136 2808";
const CONFIRMATION_MESSAGE =
  "U ontvangt een e-mail van ons binnen de 3 dagen na ontvangst van betaling.";

type Category = "plank" | "wijn_wit" | "wijn_rood" | "wijn_zoet";

type Product = {
  id: number;
  name: string;
  category: Category;
  price: number;
  imageUrl: string | null;
  beschrijving: string | null;
  volume: string | null;
  aanbevolenBij: string | null;
};

type CartLine = {
  productId: number;
  name: string;
  category: Category;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

function normalizeProduct(raw: any): Product {
  const attrs = raw.attributes ?? raw;
  const imageData = attrs.image?.data
    ? attrs.image.data.attributes
    : attrs.image ?? null;
  let imageUrl: string | null = imageData?.url ?? null;
  if (imageUrl && !imageUrl.startsWith("http")) {
    imageUrl = `${STRAPI_URL}${imageUrl}`;
  }
  return {
    id: raw.id,
    name: attrs.name,
    category: attrs.category,
    price: Number(attrs.price),
    imageUrl,
    beschrijving: attrs.beschrijving ?? null,
    volume: attrs.volume ?? null,
    aanbevolenBij: attrs.aanbevolenBij ?? null,
  };
}

function genReference() {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${Date.now().toString(36).toUpperCase()}-${rand}`;
}

const WINE_LABELS: Record<string, string> = {
  wijn_wit: "Witte Wijn",
  wijn_rood: "Rode Wijn",
  wijn_zoet: "Zoete Wijn",
}

export default function BestelPagina() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"form" | "review" | "submitting" | "done" | "error">("form");
  const [reference, setReference] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch(`${STRAPI_URL}/api/products?filters[active][$eq]=true&populate=image`)
      .then((res) => {
        if (!res.ok) throw new Error(`Kon producten niet laden (${res.status})`);
        return res.json();
      })
      .then((json) => {
        const list = (json.data || []).map(normalizeProduct);
        setProducts(list);
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const planks = products.filter((p) => p.category === "plank");
  const wijnWit = products.filter((p) => p.category === "wijn_wit");
  const wijnRood = products.filter((p) => p.category === "wijn_rood");
  const wijnZoet = products.filter((p) => p.category === "wijn_zoet");

  function setQty(id: number, qty: number) {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, qty) }));
  }

  const cart: CartLine[] = useMemo(
    () =>
      products
        .filter((p) => (quantities[p.id] || 0) > 0)
        .map((p) => ({
          productId: p.id,
          name: p.name,
          category: p.category,
          unitPrice: p.price,
          quantity: quantities[p.id],
          lineTotal: quantities[p.id] * p.price,
        })),
    [products, quantities]
  );

  const total = cart.reduce((sum, l) => sum + l.lineTotal, 0);

  function goToReview(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMsg("Kies minstens één item.");
      return;
    }
    setErrorMsg("");
    setStep("review");
  }

  async function confirmOrder() {
    setStep("submitting");
    const ref = genReference();
    try {
      const res = await fetch(`${STRAPI_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            reference: ref,
            customerName: name,
            email,
            items: cart,
            totalPrice: total,
            status: "pending",
          },
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message || `Fout (${res.status})`);
      }
      setReference(ref);
      setStep("done");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Er ging iets mis, probeer opnieuw."
      );
      setStep("error");
    }
  }

  // --- Wine product card ---
  const WineCard = ({ p }: { p: Product }) => (
    <div style={styles.wineCard}>
      <div style={styles.wineCardTop}>
        {p.imageUrl && (
          <img src={p.imageUrl} alt={p.name} style={styles.wineImg} />
        )}
        <div style={styles.wineInfo}>
          <strong>{p.name}</strong>
          {p.volume && <span style={styles.wineDetail}>🍾 {p.volume}</span>}
          {p.beschrijving && <p style={styles.wineBeschrijving}>{p.beschrijving}</p>}
          {p.aanbevolenBij && (
            <span style={styles.aanbevolen}>🧀 {p.aanbevolenBij}</span>
          )}
        </div>
      </div>
      <div style={styles.wineBottom}>
        <strong>€{p.price.toFixed(2)}</strong>
        <input
          type="number"
          min={0}
          value={quantities[p.id] || 0}
          onChange={(e) => setQty(p.id, Number(e.target.value))}
          style={styles.qtyInput}
        />
      </div>
    </div>
  )

  if (loading) return <main style={styles.wrap}><p>Laden...</p></main>;
  if (loadError) return <main style={styles.wrap}><p style={{ color: "crimson" }}>{loadError}</p></main>;

  if (step === "done") {
    return (
      <main style={styles.wrap}>
        <div style={styles.card}>
          <h1 style={styles.h1}>✅ Bestelling ontvangen</h1>
          <p>Referentie: <strong>{reference}</strong></p>
          <p>Te betalen: <strong>€{total.toFixed(2)}</strong></p>
          <p>
            Over te schrijven naar <strong>{BANK_ACCOUNT}</strong> met{" "}
            <strong>{reference}</strong> als mededeling.
          </p>
          <p>{CONFIRMATION_MESSAGE}</p>
        </div>
      </main>
    );
  }

  if (step === "review" || step === "submitting" || step === "error") {
    return (
      <main style={styles.wrap}>
        <div style={styles.card}>
          <h1 style={styles.h1}>Controleer je bestelling</h1>
          {cart.map((l) => (
            <div key={l.productId} style={styles.row}>
              <span>{l.quantity}× {l.name}</span>
              <span>€{l.lineTotal.toFixed(2)}</span>
            </div>
          ))}
          <div style={{ ...styles.row, fontWeight: 700 }}>
            <span>Totaal</span>
            <span>€{total.toFixed(2)}</span>
          </div>
          <p>{name} — {email}</p>
          {errorMsg && <p style={{ color: "crimson" }}>{errorMsg}</p>}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
            <button
              onClick={() => setStep("form")}
              style={{ ...styles.button, background: "#666" }}
              disabled={step === "submitting"}
            >
              Aanpassen
            </button>
            <button
              onClick={confirmOrder}
              style={styles.button}
              disabled={step === "submitting"}
            >
              {step === "submitting" ? "Bezig..." : "Bevestigen"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.wrap}>
      <form onSubmit={goToReview} style={styles.card}>
        <h1 style={styles.h1}>Bestel je borrelplank &amp; wijn</h1>
        <p style={styles.intro}>Bestel op voorhand, geniet tijdens het evenement. Betalen via overschrijving.</p>

        {/* Planks */}
        {planks.length > 0 && (
          <>
            <h2 style={styles.h2}>Borrelplanken</h2>
            {planks.map((p) => (
              <div key={p.id} style={styles.row}>
                <span>{p.name} — €{p.price.toFixed(2)}</span>
                <input
                  type="number"
                  min={0}
                  value={quantities[p.id] || 0}
                  onChange={(e) => setQty(p.id, Number(e.target.value))}
                  style={styles.qtyInput}
                />
              </div>
            ))}
          </>
        )}

        {/* White wine */}
        {wijnWit.length > 0 && (
          <>
            <h2 style={styles.h2}>🥂 Witte Wijn</h2>
            {wijnWit.map((p) => <WineCard key={p.id} p={p} />)}
          </>
        )}

        {/* Red wine */}
        {wijnRood.length > 0 && (
          <>
            <h2 style={styles.h2}>🍷 Rode Wijn</h2>
            {wijnRood.map((p) => <WineCard key={p.id} p={p} />)}
          </>
        )}

        {/* Sweet wine */}
        {wijnZoet.length > 0 && (
          <>
            <h2 style={styles.h2}>🍬 Zoete Wijn</h2>
            {wijnZoet.map((p) => <WineCard key={p.id} p={p} />)}
          </>
        )}

        <div style={{ ...styles.row, fontWeight: 700, marginTop: "0.5rem" }}>
          <span>Totaal</span>
          <span>€{total.toFixed(2)}</span>
        </div>

        <label style={styles.label}>
          Naam
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          E-mail
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </label>

        {errorMsg && <p style={{ color: "crimson" }}>{errorMsg}</p>}
        <button type="submit" style={styles.button}>Bestelling bekijken</button>
      </form>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { display: "flex", justifyContent: "center", padding: "2rem 1rem", fontFamily: "system-ui, sans-serif" },
  card: { width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: "0.6rem" },
  h1: { fontSize: "1.5rem", marginBottom: "0.25rem" },
  h2: { fontSize: "1.1rem", marginTop: "1.25rem", marginBottom: "0.25rem" },
  intro: { color: "#555", fontSize: "0.9rem" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", padding: "0.4rem 0" },
  qtyInput: { width: 60, padding: "0.25rem", textAlign: "center" },
  wineCard: { border: "1px solid #eee", borderRadius: 8, padding: "0.75rem", marginBottom: "0.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" },
  wineCardTop: { display: "flex", gap: "0.75rem", alignItems: "flex-start" },
  wineImg: { width: 90, height: 90, objectFit: "cover", borderRadius: 6, flexShrink: 0 },
  wineInfo: { display: "flex", flexDirection: "column", gap: "0.2rem", flex: 1 },
  wineDetail: { fontSize: "0.9rem", color: "#333", fontWeight: "bold" },
  wineBeschrijving: { fontSize: "0.85rem", color: "#444", margin: 0 },
  aanbevolen: { fontSize: "0.8rem", color: "#7a5c2e", fontStyle: "italic" },
  wineBottom: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f0f0f0", paddingTop: "0.5rem" },
  label: { display: "flex", flexDirection: "column", gap: "0.25rem" },
  input: { padding: "0.5rem", border: "1px solid #ccc", borderRadius: 6 },
  button: { marginTop: "1rem", padding: "0.75rem", background: "#7a1f2b", color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer" },
};