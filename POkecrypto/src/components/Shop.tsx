import { useGameStore } from '../store/gameStore';

interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  price: number;
  currency: 'coins' | 'gems';
  action: () => void;
}

export default function Shop() {
  const { setScreen, coins, gems } = useGameStore();

  const buyBalls = (qty: number, cost: number) => {
    if (coins < cost) return;
    useGameStore.setState((s) => ({
      coins: s.coins - cost,
      cryptoBalls: s.cryptoBalls + qty,
    }));
  };

  const buyPotion = (key: string, cost: number) => {
    if (coins < cost) return;
    useGameStore.setState((s) => ({
      coins: s.coins - cost,
      inventory: { ...s.inventory, [key]: (s.inventory as any)[key] + 1 },
    }));
  };

  const buyGems = (qty: number, cost: number) => {
    if (coins < cost) return;
    useGameStore.setState((s) => ({
      coins: s.coins - cost,
      gems: s.gems + qty,
    }));
  };

  const items: ShopItem[] = [
    { id: 'balls5', name: '5 CryptoBalls', emoji: '🔮', desc: 'Capture pets selvagens', price: 100, currency: 'coins', action: () => buyBalls(5, 100) },
    { id: 'balls20', name: '20 CryptoBalls', emoji: '🔮', desc: 'Pacote econômico', price: 350, currency: 'coins', action: () => buyBalls(20, 350) },
    { id: 'balls50', name: '50 CryptoBalls', emoji: '🔮', desc: 'Mega pacote!', price: 800, currency: 'coins', action: () => buyBalls(50, 800) },
    { id: 'hpPot', name: 'Poção Vida', emoji: '❤️', desc: '+10 HP max', price: 80, currency: 'coins', action: () => buyPotion('potionHp', 80) },
    { id: 'atkPot', name: 'Elixir Força', emoji: '⚔️', desc: '+5 Ataque', price: 120, currency: 'coins', action: () => buyPotion('potionAtk', 120) },
    { id: 'defPot', name: 'Escudo Mágico', emoji: '🛡️', desc: '+5 Defesa', price: 120, currency: 'coins', action: () => buyPotion('potionDef', 120) },
    { id: 'spdPot', name: 'Botas Vento', emoji: '💨', desc: '+5 Velocidade', price: 120, currency: 'coins', action: () => buyPotion('potionSpd', 120) },
    { id: 'gems5', name: '5 Gemas', emoji: '💎', desc: 'Gemas premium', price: 500, currency: 'coins', action: () => buyGems(5, 500) },
  ];

  const card = { background: '#111128', border: '1px solid #252550', borderRadius: 14 };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0b20' }}>
      {/* Header */}
      <div style={{ padding: '16px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#111128', borderBottom: '1px solid #252550' }}>
        <button onClick={() => setScreen('menu')} style={{ color: '#eab308', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>← Menu</button>
        <span style={{ color: '#a855f7', fontWeight: 700, fontSize: 17 }}>🛒 Loja</span>
        <div style={{ display: 'flex', gap: 10, fontSize: 12, fontWeight: 700 }}>
          <span style={{ color: '#eab308' }}>💰{coins}</span>
          <span style={{ color: '#a855f7' }}>💎{gems}</span>
        </div>
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {items.map((item) => {
            const canBuy = item.currency === 'coins' ? coins >= item.price : gems >= item.price;
            return (
              <div key={item.id} style={{ ...card, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 32 }}>{item.emoji}</span>
                <p style={{ color: 'white', fontWeight: 700, fontSize: 12, textAlign: 'center' }}>{item.name}</p>
                <p style={{ color: '#6b7280', fontSize: 10, textAlign: 'center' }}>{item.desc}</p>
                <button
                  onClick={item.action}
                  disabled={!canBuy}
                  className="active:scale-95 transition-transform"
                  style={{
                    width: '100%', padding: '10px 0', borderRadius: 10, border: 'none', cursor: canBuy ? 'pointer' : 'not-allowed',
                    background: canBuy ? 'linear-gradient(90deg,#7c3aed,#8b5cf6)' : '#374151',
                    color: 'white', fontSize: 11, fontWeight: 700, opacity: canBuy ? 1 : 0.5,
                  }}
                >
                  {item.currency === 'coins' ? '💰' : '💎'} {item.price}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
