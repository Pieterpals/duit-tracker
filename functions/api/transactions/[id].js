export async function onRequestDelete(context) {
  try {
    const id = context.params.id;
    await context.env.DB.prepare("DELETE FROM transactions WHERE id = ?").bind(id).run();
    return new Response(null, { status: 204 });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}