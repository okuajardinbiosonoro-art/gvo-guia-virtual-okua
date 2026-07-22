const world4RuntimeBase = "/assets/gvo/stations/world-4/system-table/runtime";

export const world4RuntimeAssets = {
  environment: {
    base: `${world4RuntimeBase}/environment/world4_environment_base_v01.webp`,
    rearDepthPlane: `${world4RuntimeBase}/environment/world4_rear_depth_plane_v01.png`,
    haze: `${world4RuntimeBase}/environment/world4_haze_overlay_v01.png`,
  },
  table: {
    contactShadow: `${world4RuntimeBase}/table/world4_table_contact_shadow_v01.png`,
    lowerBase: `${world4RuntimeBase}/table/world4_table_lower_base_v01.png`,
    frontEdge: `${world4RuntimeBase}/table/world4_table_front_edge_v01.png`,
    top: `${world4RuntimeBase}/table/world4_table_top_v01.png`,
  },
  route: {
    passive: `${world4RuntimeBase}/route/world4_system_route_base_v01.png`,
  },
  nodes: {
    haloSheet: `${world4RuntimeBase}/nodes/world4_node_state_halo_sheet_v01.png`,
    pedestal: `${world4RuntimeBase}/nodes/world4_node_pedestal_v01.png`,
  },
  objects: {
    planta: `${world4RuntimeBase}/objects/world4_node_plant_v01.png`,
    bionosificador: `${world4RuntimeBase}/objects/world4_node_bionosifier_v01.png`,
    esp32: `${world4RuntimeBase}/objects/world4_node_esp32_v01.png`,
    midi: `${world4RuntimeBase}/objects/world4_node_midi_v01.png`,
    wifi_udp: `${world4RuntimeBase}/objects/world4_node_wifi_udp_v01.png`,
    router: `${world4RuntimeBase}/objects/world4_node_router_v01.png`,
    sistema_central: `${world4RuntimeBase}/objects/world4_node_central_system_v01.png`,
    sonido: `${world4RuntimeBase}/objects/world4_node_sound_v01.png`,
  },
  ui: {
    textCard: `${world4RuntimeBase}/ui/world4_text_card_backplate_v01.png`,
    openWorld5: `${world4RuntimeBase}/ui/world4_open_world5_button_backplate_v01.png`,
  },
} as const;

const liaBase = "/assets/gvo/shared/lia/current-used/portada-intro";

export const world4SharedLiaAssets = {
  guide: `${liaBase}/lia_pose_explain_calm_v1.png`,
  closure: `${liaBase}/lia_pose_greeting_v1.png`,
} as const;

export const world4RuntimeAssetPaths = [
  world4RuntimeAssets.environment.base,
  world4RuntimeAssets.environment.rearDepthPlane,
  world4RuntimeAssets.environment.haze,
  world4RuntimeAssets.table.contactShadow,
  world4RuntimeAssets.table.lowerBase,
  world4RuntimeAssets.table.frontEdge,
  world4RuntimeAssets.table.top,
  world4RuntimeAssets.route.passive,
  world4RuntimeAssets.nodes.haloSheet,
  world4RuntimeAssets.nodes.pedestal,
  world4RuntimeAssets.objects.planta,
  world4RuntimeAssets.objects.bionosificador,
  world4RuntimeAssets.objects.esp32,
  world4RuntimeAssets.objects.midi,
  world4RuntimeAssets.objects.wifi_udp,
  world4RuntimeAssets.objects.router,
  world4RuntimeAssets.objects.sistema_central,
  world4RuntimeAssets.objects.sonido,
  world4RuntimeAssets.ui.textCard,
  world4RuntimeAssets.ui.openWorld5,
] as const;
