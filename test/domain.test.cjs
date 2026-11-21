const test = require('node:test');
const assert = require('node:assert/strict');
const {
  userService,
  roomService,
  equipmentService,
  loanService,
  incidentService,
  dashboardService
} = require('../dist/src/container');

test('gestiona usuarios, ambientes, activos, préstamos, devoluciones y novedades', () => {
  const suffix = Date.now().toString();
  const guarda = userService.create({
    email: `guarda-${suffix}@controllabs.test`,
    nombre: 'Guarda de prueba',
    rol: 'GUARDA'
  });
  const instructor = userService.create({
    email: `instructor-${suffix}@controllabs.test`,
    nombre: 'Instructor de prueba',
    rol: 'INSTRUCTOR'
  });

  assert.throws(
    () => userService.create({ email: guarda.email, nombre: 'Duplicado', rol: 'GUARDA' }),
    (error) => error.code === 'CONFLICT'
  );

  const room = roomService.create({
    nombre: `Sala de prueba ${suffix}`,
    bloque: 'Bloque de pruebas',
    capacidadPcs: 1
  });
  const computer = equipmentService.create({
    placaSena: `PLACA-${suffix}`,
    codigoActivo: `ACTIVO-${suffix}`,
    tipo: 'COMPUTADOR',
    roomId: room.id
  });

  assert.throws(
    () => equipmentService.create({
      placaSena: `PLACA-2-${suffix}`,
      codigoActivo: `ACTIVO-2-${suffix}`,
      tipo: 'COMPUTADOR',
      roomId: room.id
    }),
    (error) => error.code === 'CONFLICT'
  );

  const loan = loanService.create({
    roomId: room.id,
    instructorId: instructor.id,
    guardaId: guarda.id,
    numeroPc: 1,
    equipmentIds: [computer.id]
  });
  assert.equal(loan.estado, 'PENDIENTE_APROBACION');
  assert.equal(loan.equipment.length, 1);

  const accepted = loanService.accept(String(loan.id));
  assert.equal(accepted.estado, 'APROBADO_Y_FIRMADO');
  assert.ok(accepted.acceptedAt);

  const incident = incidentService.create({
    equipmentId: computer.id,
    reportedBy: guarda.id,
    descripcion: 'Equipo de prueba con una falla',
    prioridad: 'MEDIA'
  });
  assert.equal(incident.estado, 'PENDIENTE');

  incidentService.updateStatus(String(incident.id), { estado: 'EN_PROCESO' });
  const resolved = incidentService.updateStatus(String(incident.id), {
    estado: 'RESUELTA',
    resolvedBy: guarda.id
  });
  assert.ok(resolved.resolvedAt);

  const returned = loanService.returnAllEquipment(String(loan.id));
  assert.ok(returned.equipment[0].returnedAt);
  assert.equal(dashboardService.summary().loans.equipmentOnLoan, 0);
});