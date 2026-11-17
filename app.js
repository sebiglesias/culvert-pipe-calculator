
function init() {
  ['drivewayWid', 'ditchDepth', 'pipeDia', 'endTreatment'].forEach(id => {
    document.getElementById(id).addEventListener('change', calc);
    document.getElementById(id).addEventListener('input', calc);
  });
  calc();
}

function calc() {
  const wid = parseFloat(document.getElementById('drivewayWid').value)||16;
  const ditch = parseFloat(document.getElementById('ditchDepth').value)||28;
  const dia = parseFloat(document.getElementById('pipeDia').value)||15;
  const end = document.getElementById('endTreatment').value;

  // Cover depth = ditchDepth - pipeDia
  const cover = ditch - dia;

  // Pipe length flaring: 2 * (ditchDepth / 12) * slopeRatio
  let extraFt = 0;
  if (end === "headwall") {
    extraFt = 2; // slight overhang past wall
  } else {
    const slopeRatio = parseFloat(end)||2.0;
    extraFt = 2 * (ditch / 12) * slopeRatio;
  }

  const rawLen = wid + extraFt;
  // Round up to commercial sticks (20ft, 24ft, 30ft)
  let pipeLen = Math.ceil(rawLen / 2) * 2;
  if (pipeLen < 20) pipeLen = 20;

  // Flow capacity approximation: CFS for Manning's n=0.012 at 1% slope
  const cfsMap = { "12": 3.2, "15": 5.8, "18": 9.4, "24": 20.1 };
  const cfs = cfsMap[dia.toString()] || 5.8;

  // Backfill tons
  const backfillCuYds = (pipeLen * 6 * (ditch / 12)) / 27;
  const tons = backfillCuYds * 1.4;

  document.getElementById('pipeLength').textContent = `${pipeLen} ft`;
  document.getElementById('coverSummary').textContent = `Gravel Cover Above Pipe: ${cover.toFixed(1)} Inches (${cover >= 12 ? 'H-20 Safe' : 'Warning: Add More Cover!'})`;
  document.getElementById('backfillTons').textContent = `${tons.toFixed(1)} Tons`;
  document.getElementById('flowCfs').textContent = `≈ ${cfs} CFS`;
}
window.addEventListener('DOMContentLoaded', init);
