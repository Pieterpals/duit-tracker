export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(
      "SELECT * FROM transactions ORDER BY created_at DESC"
    ).all();
    return Response.json(results);
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const tx = await context.request.json();
    const id = tx.id || crypto.randomUUID();
    
    await context.env.DB.prepare(
      "INSERT INTO transactions (id, type, amount, category, date, note) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(id, tx.type, tx.amount, tx.category, tx.date, tx.note || '').run();

    const { results } = await context.env.DB.prepare("SELECT * FROM transactions WHERE id = ?").bind(id).all();
    return Response.json(results[0]);
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}

export async function onRequestDelete(context) {
  // Untuk handle "Hapus Semua" jika kita memanggil DELETE ke /api/transactions
  try {
    await context.env.DB.prepare("DELETE FROM transactions").run();
    return new Response(null, { status: 204 });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}