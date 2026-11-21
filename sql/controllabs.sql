CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  nombre VARCHAR(150) NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('ADMIN', 'GUARDA', 'INSTRUCTOR')),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL UNIQUE,
  bloque VARCHAR(50) NOT NULL,
  capacidad_pcs INTEGER NOT NULL CHECK (capacidad_pcs >= 0),
  estado VARCHAR(20) NOT NULL DEFAULT 'OPERATIVO'
    CHECK (estado IN ('OPERATIVO', 'MANTENIMIENTO', 'INACTIVO'))
);

CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  placa_sena VARCHAR(50) NOT NULL UNIQUE,
  codigo_activo VARCHAR(100) NOT NULL UNIQUE,
  tipo VARCHAR(50) NOT NULL
    CHECK (tipo IN ('COMPUTADOR', 'MOUSE', 'TECLADO', 'CARGADOR', 'TELEVISOR', 'CONTROL_TV')),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
  estado VARCHAR(20) NOT NULL DEFAULT 'OPERATIVO'
    CHECK (estado IN ('OPERATIVO', 'MANTENIMIENTO', 'FUERA_DE_SERVICIO'))
);

CREATE TABLE loans (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
  instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  guarda_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  numero_pc INTEGER NOT NULL CHECK (numero_pc > 0),
  estado VARCHAR(24) NOT NULL DEFAULT 'PENDIENTE_APROBACION'
    CHECK (estado IN ('PENDIENTE_APROBACION', 'APROBADO_Y_FIRMADO')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  CHECK (
    (estado = 'PENDIENTE_APROBACION' AND accepted_at IS NULL) OR
    (estado = 'APROBADO_Y_FIRMADO' AND accepted_at IS NOT NULL)
  )
);

CREATE TABLE loan_equipment (
  loan_id BIGINT NOT NULL REFERENCES loans(id) ON DELETE RESTRICT,
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE RESTRICT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  returned_at TIMESTAMPTZ,
  CHECK (returned_at IS NULL OR returned_at >= assigned_at),
  PRIMARY KEY (loan_id, equipment_id)
);

CREATE TABLE incidents (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE RESTRICT,
  reported_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  descripcion TEXT NOT NULL,
  prioridad VARCHAR(10) NOT NULL CHECK (prioridad IN ('BAJA', 'MEDIA', 'ALTA')),
  estado VARCHAR(16) NOT NULL DEFAULT 'PENDIENTE'
    CHECK (estado IN ('PENDIENTE', 'EN_PROCESO', 'RESUELTA')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id) ON DELETE RESTRICT,
  CHECK (
    (estado = 'RESUELTA' AND resolved_at IS NOT NULL AND resolved_by IS NOT NULL) OR
    (estado <> 'RESUELTA' AND resolved_at IS NULL AND resolved_by IS NULL)
  )
);

CREATE INDEX idx_equipment_room ON equipment(room_id);
CREATE INDEX idx_loans_room_created ON loans(room_id, created_at DESC);
CREATE INDEX idx_incidents_equipment_status ON incidents(equipment_id, estado);
CREATE UNIQUE INDEX uq_loan_equipment_active
  ON loan_equipment(equipment_id)
  WHERE returned_at IS NULL;

INSERT INTO users (id, email, nombre, rol, activo) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin.sena@sena.edu.co', 'Carlos Administrador', 'ADMIN', TRUE),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'guarda.seguridad@sena.edu.co', 'Alberto Guarda', 'GUARDA', TRUE),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'instructor.ti@sena.edu.co', 'Diana Instructor', 'INSTRUCTOR', TRUE);

DO $$
DECLARE
  room_number INTEGER;
  room_uuid UUID;
  block_name VARCHAR(50);
  item_number INTEGER;
BEGIN
  FOR room_number IN 301..510 LOOP
    IF room_number <= 399 THEN
      block_name := 'Bloque 3';
    ELSIF room_number <= 499 THEN
      block_name := 'Bloque 4';
    ELSE
      block_name := 'Bloque 5';
    END IF;

    INSERT INTO rooms (nombre, bloque, capacidad_pcs, estado)
    VALUES ('Sala ' || room_number, block_name, 30, 'OPERATIVO')
    RETURNING id INTO room_uuid;

    FOR item_number IN 1..30 LOOP
      INSERT INTO equipment (placa_sena, codigo_activo, tipo, room_id, estado)
      VALUES
        ('SENA-PC-' || room_number || '-' || item_number, 'ACT-PC-' || room_number || '-' || item_number, 'COMPUTADOR', room_uuid, 'OPERATIVO'),
        ('SENA-MS-' || room_number || '-' || item_number, 'ACT-MS-' || room_number || '-' || item_number, 'MOUSE', room_uuid, 'OPERATIVO'),
        ('SENA-TC-' || room_number || '-' || item_number, 'ACT-TC-' || room_number || '-' || item_number, 'TECLADO', room_uuid, 'OPERATIVO'),
        ('SENA-CR-' || room_number || '-' || item_number, 'ACT-CR-' || room_number || '-' || item_number, 'CARGADOR', room_uuid, 'OPERATIVO');
    END LOOP;

    FOR item_number IN 1..2 LOOP
      INSERT INTO equipment (placa_sena, codigo_activo, tipo, room_id, estado)
      VALUES
        ('SENA-TV-' || room_number || '-' || item_number, 'ACT-TV-' || room_number || '-' || item_number, 'TELEVISOR', room_uuid, 'OPERATIVO'),
        ('SENA-CTRL-' || room_number || '-' || item_number, 'ACT-CTRL-' || room_number || '-' || item_number, 'CONTROL_TV', room_uuid, 'OPERATIVO');
    END LOOP;
  END LOOP;
END $$;