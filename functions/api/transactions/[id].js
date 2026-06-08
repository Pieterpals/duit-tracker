export async function onRequestPut(context) {
  try {
    const id = context.params.id;
    const tx = await context.request.json();

    await context.env.DB.prepare(
      `UPDATE transactions 
       SET type = ?, amount = ?, category = ?, date = ?, note = ?, user_id = ?
       WHERE id = ?`
    ).bind(
      tx.type, tx.amount, tx.category, tx.date, tx.note || '', tx.user_id || 'unknown', id
    ).run();

    const { results } = await context.env.DB.prepare(
      "SELECT * FROM transactions WHERE id = ?"
    ).bind(id).all();

    if (!results.length) {
      return new Response("Transaction not found", { status: 404 });
    }

    return Response.json(results[0]);
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}

export async function onRequestDelete(context) {
  try {
    const id = context.params.id;
    await context.env.DB.prepare("DELETE FROM transactions WHERE id = ?").bind(id).run();
    return new Response(null, { status: 204 });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}