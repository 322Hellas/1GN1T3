let currentConfig = {};
export function buildRibbon(configOrTab){
  if(typeof configOrTab === "object") currentConfig = configOrTab;
  const tab = typeof configOrTab === "string" ? configOrTab : "home";

  const area = document.getElementById("ribbonRow");
  area.innerHTML = "";

  (currentConfig[tab] || []).forEach(groupArr => {
    // we’re passing a flat array; wrap it in a single group
    const group = document.createElement("div");
    group.className = "ribbon-group";

    const btnBar = document.createElement("div");
    btnBar.className = "buttons";
    group.appendChild(btnBar);

    [groupArr].flat().forEach(btnCfg=>{
    const b = document.createElement("button");
       b.className = "ribbon-btn";
       /* SVG icon string + caption */
       b.innerHTML = `${btnCfg.icon}<span>${btnCfg.label}</span>`;     
       b.addEventListener("click", btnCfg.action);
      btnBar.appendChild(b);
    });

    area.appendChild(group);
  });
}
