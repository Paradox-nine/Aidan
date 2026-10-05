-- Enable pgvector extension for embedding vector storage and similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Table for storing official CEIT PDF metadata uploaded to Supabase Storage
CREATE TABLE IF NOT EXISTS ceit_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    storage_url TEXT NOT NULL,
    category TEXT DEFAULT 'Official Notice',
    total_pages INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for extracted PDF text chunks and their 1536-dimensional vector embeddings
CREATE TABLE IF NOT EXISTS ceit_pdf_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES ceit_documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(1536) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for accelerating vector similarity search using HNSW cosine distance
CREATE INDEX IF NOT EXISTS ceit_pdf_chunks_embedding_hnsw_idx
ON ceit_pdf_chunks
USING hnsw (embedding vector_cosine_ops);

-- Stored procedure for performing similarity search against stored PDF chunks
CREATE OR REPLACE FUNCTION match_pdf_chunks(
    query_embedding VECTOR(1536),
    match_threshold FLOAT DEFAULT 0.5,
    match_count INT DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    document_id UUID,
    chunk_index INT,
    content TEXT,
    similarity FLOAT,
    metadata JSONB,
    doc_title TEXT,
    doc_storage_url TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.document_id,
        c.chunk_index,
        c.content,
        1 - (c.embedding <=> query_embedding) AS similarity,
        c.metadata,
        d.title AS doc_title,
        d.storage_url AS doc_storage_url
    FROM ceit_pdf_chunks c
    JOIN ceit_documents d ON c.document_id = d.id
    WHERE 1 - (c.embedding <=> query_embedding) > match_threshold
    ORDER BY c.embedding <=> query_embedding ASC
    LIMIT match_count;
END;
$$;
