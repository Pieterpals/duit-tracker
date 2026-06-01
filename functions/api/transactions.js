export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const userId = url.searchParams.get('user_id');

    let results;
    if (userId) {
      ({ results } = await context.env.DB.prepare(
        "SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC"
      ).bind(userId).all());
    } else {
      ({ results } = await context.env.DB.prepare(
        "SELECT * FROM transactions ORDER BY created_at DESC"
      ).all());
    }
    return Response.json(results);
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const tx = await context.request.json();
    const id = tx.id || crypto.randomUUID();
    const userId = tx.user_id || 'unknown';
    
    await context.env.DB.prepare(
      "INSERT INTO transactions (id, type, amount, category, date, note, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(id, tx.type, tx.amount, tx.category, tx.date, tx.note || '', userId).run();

    const { results } = await context.env.DB.prepare("SELECT * FROM transactions WHERE id = ?").bind(id).all();
    return Response.json(results[0]);
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}

export async function onRequestDelete(context) {
  try {
    const url = new URL(context.request.url);
    const userId = url.searchParams.get('user_id');

    if (userId) {
      await context.env.DB.prepare("DELETE FROM transactions WHERE user_id = ?").bind(userId).run();
    } else {
      await context.env.DB.prepare("DELETE FROM transactions").run();
    }
    return new Response(null, { status: 204 });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}