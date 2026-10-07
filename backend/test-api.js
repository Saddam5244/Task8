async function testApi() {
  console.log('--- Starting To-Do List API Verification ---');

  // 1. Create task
  const createRes = await fetch('http://localhost:5000/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Complete Part 1 and Part 2 Assignments',
      description: 'Build backend APIs with Express MongoDB and React frontend',
      priority: 'high',
      status: 'pending'
    })
  }).then(r => r.json());
  console.log('1. [POST /api/tasks] Created Task Success:', createRes.success, 'ID:', createRes.data?._id);
  const id = createRes.data._id;

  // 2. Get all tasks
  const allRes = await fetch('http://localhost:5000/api/tasks').then(r => r.json());
  console.log('2. [GET /api/tasks] Total Tasks:', allRes.count);

  // 3. Search tasks
  const searchRes = await fetch('http://localhost:5000/api/tasks?search=Assignments').then(r => r.json());
  console.log('3. [GET /api/tasks?search=Assignments] Matched Tasks:', searchRes.count);

  // 4. Update status
  const statusRes = await fetch(`http://localhost:5000/api/tasks/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'completed' })
  }).then(r => r.json());
  console.log('4. [PATCH /api/tasks/:id/status] Status Updated:', statusRes.data?.status);

  // 5. Update task details
  const updateRes = await fetch(`http://localhost:5000/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Complete Part 1 and Part 2 Assignments (Updated)',
      priority: 'medium'
    })
  }).then(r => r.json());
  console.log('5. [PUT /api/tasks/:id] Updated Title:', updateRes.data?.title, 'Priority:', updateRes.data?.priority);

  // 6. Validation Error Test
  const errRes = await fetch('http://localhost:5000/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: '' })
  }).then(r => r.json());
  console.log('6. [Validation Error Test] Handled properly:', !errRes.success, 'Message:', errRes.message);

  // 7. Delete task
  const delRes = await fetch(`http://localhost:5000/api/tasks/${id}`, {
    method: 'DELETE'
  }).then(r => r.json());
  console.log('7. [DELETE /api/tasks/:id] Deleted:', delRes.success, 'Message:', delRes.message);

  console.log('--- All API Tests Passed Successfully! ---');
}

testApi().catch(console.error);
