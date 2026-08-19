// Mobile interaction layer: lightweight controls that sit on top of the existing 3D scene.
const isMobile = matchMedia('(max-width: 850px)').matches || navigator.maxTouchPoints > 0;
if (isMobile) {
  const hud = document.querySelector('.hud');
  if (hud && !document.querySelector('.joy')) {
    const joy = document.createElement('div');
    joy.className = 'joy';
    joy.setAttribute('aria-label','Virtual movement joystick');
    joy.innerHTML = '<i></i>';
    hud.appendChild(joy);

    const knob = joy.querySelector('i');
    let active = false;
    const move = (x,y) => {
      const r = joy.getBoundingClientRect();
      const cx = r.left + r.width/2, cy = r.top + r.height/2;
      let dx=x-cx, dy=y-cy;
      const max=r.width*.30, len=Math.hypot(dx,dy)||1;
      if(len>max){dx=dx/len*max;dy=dy/len*max;}
      knob.style.transform=`translate(${dx}px,${dy}px)`;
      // Expose normalized input for the simulator without coupling this layer to the engine.
      window.dispatchEvent(new CustomEvent('scienceverse:move',{detail:{x:dx/max,y:dy/max}}));
    };
    const end=()=>{active=false;knob.style.transform='translate(0,0)';window.dispatchEvent(new CustomEvent('scienceverse:move',{detail:{x:0,y:0}}));};
    joy.addEventListener('pointerdown',e=>{active=true;joy.setPointerCapture(e.pointerId);move(e.clientX,e.clientY);});
    joy.addEventListener('pointermove',e=>{if(active)move(e.clientX,e.clientY);});
    joy.addEventListener('pointerup',end);
    joy.addEventListener('pointercancel',end);
  }
}

// Prevent accidental browser gestures while manipulating the 3D world.
document.addEventListener('touchmove',e=>{
  if(e.target.closest('#scene,.joy')) e.preventDefault();
},{passive:false});
