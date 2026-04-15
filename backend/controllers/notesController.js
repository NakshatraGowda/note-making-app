const { pool } = require('../config/db');

const getAllNotes = async (req, res) => {
  try {
    const { search, tag } = req.query;
    console.log('Fetching notes with filters:', { search, tag });
    let query = 'SELECT * FROM notes';
    const params = [];
    const conditions = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(title ILIKE $${params.length} OR content ILIKE $${params.length})`);
    }

    if (tag) {
      params.push(tag);
      conditions.push(`$${params.length} = ANY(tags)`);
    }

    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY pinned DESC, updated_at DESC';

    console.log('Executing query:', { query, params });
    const result = await pool.query(query, params);
    console.log('Found notes:', result.rows.length);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getNoteById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notes WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ success: false, error: 'Note not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const createNote = async (req, res) => {
  try {
    const { title, content, color = '#ffffff', tags = [] } = req.body;
    if (!title) return res.status(400).json({ success: false, error: 'Title is required' });

    console.log('Creating note:', { title, content, color, tags });
    const result = await pool.query(
      'INSERT INTO notes (title, content, color, tags) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, color, tags]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { title, content, color, tags } = req.body;
    const result = await pool.query(
      `UPDATE notes SET
        title = COALESCE($1, title),
        content = COALESCE($2, content),
        color = COALESCE($3, color),
        tags = COALESCE($4, tags),
        updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [title, content, color, tags, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ success: false, error: 'Note not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM notes WHERE id = $1 RETURNING *', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ success: false, error: 'Note not found' });
    res.json({ success: true, message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const togglePin = async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE notes SET pinned = NOT pinned, updated_at = NOW() WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ success: false, error: 'Note not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAllNotes, getNoteById, createNote, updateNote, deleteNote, togglePin };
