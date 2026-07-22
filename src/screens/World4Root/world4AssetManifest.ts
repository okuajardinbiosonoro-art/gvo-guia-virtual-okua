import type { Station4NodeId } from "./station4Content";
import { world4RuntimeAssets } from "./world4RuntimeAssets";

export type World4AlphaBounds = readonly [
  left: number,
  top: number,
  right: number,
  bottom: number,
];

type World4NodeAssetDefinition = {
  asset: string;
  alphaBounds: World4AlphaBounds;
  canvas: { width: 1024; height: 1024 };
  fullCanvasWidth: number;
};

export const world4NodeAssetManifest = {
  planta: {
    asset: world4RuntimeAssets.objects.planta,
    alphaBounds: [198, 126, 833, 893],
    canvas: { width: 1024, height: 1024 },
    fullCanvasWidth: 112,
  },
  bionosificador: {
    asset: world4RuntimeAssets.objects.bionosificador,
    alphaBounds: [193, 292, 832, 746],
    canvas: { width: 1024, height: 1024 },
    fullCanvasWidth: 96,
  },
  esp32: {
    asset: world4RuntimeAssets.objects.esp32,
    alphaBounds: [177, 279, 830, 755],
    canvas: { width: 1024, height: 1024 },
    fullCanvasWidth: 98,
  },
  midi: {
    asset: world4RuntimeAssets.objects.midi,
    alphaBounds: [80, 180, 946, 817],
    canvas: { width: 1024, height: 1024 },
    fullCanvasWidth: 88,
  },
  wifi_udp: {
    asset: world4RuntimeAssets.objects.wifi_udp,
    alphaBounds: [118, 230, 915, 818],
    canvas: { width: 1024, height: 1024 },
    fullCanvasWidth: 84,
  },
  router: {
    asset: world4RuntimeAssets.objects.router,
    alphaBounds: [98, 196, 935, 766],
    canvas: { width: 1024, height: 1024 },
    fullCanvasWidth: 84,
  },
  sistema_central: {
    asset: world4RuntimeAssets.objects.sistema_central,
    alphaBounds: [247, 136, 771, 835],
    canvas: { width: 1024, height: 1024 },
    fullCanvasWidth: 92,
  },
  sonido: {
    asset: world4RuntimeAssets.objects.sonido,
    alphaBounds: [277, 279, 748, 713],
    canvas: { width: 1024, height: 1024 },
    fullCanvasWidth: 102,
  },
} as const satisfies Record<Station4NodeId, World4NodeAssetDefinition>;

export const WORLD4_HALO_SPRITE = {
  asset: world4RuntimeAssets.nodes.haloSheet,
  canvas: { width: 1536, height: 512 },
  cell: { width: 512, height: 512 },
  cells: {
    available: 0,
    active: 1,
    completed: 2,
  },
} as const;

export const WORLD4_BACKPLATE_SLICES = {
  textCard: {
    asset: world4RuntimeAssets.ui.textCard,
    canvas: { width: 1536, height: 512 },
    borderImageSlice: "128 192 fill",
  },
  openWorld5: {
    asset: world4RuntimeAssets.ui.openWorld5,
    canvas: { width: 1024, height: 512 },
    borderImageSlice: "144 192 fill",
  },
} as const;

export const WORLD4_RUNTIME_LAYER_DECISIONS = {
  rearDepthPlane: "rear-plane-retained-after-layer-toggle",
  tableFrontEdge: "front-edge-disabled-by-human-review",
} as const;

export const WORLD4_APPROVED_ASSET_HASHES = {
  "world4_environment_base_v01.webp":
    "3EA217DD2CD32A60B975AAAC004A0939722B964043824C2831BB077150177B5F",
  "world4_rear_depth_plane_v01.png":
    "3CD13E9EC67E65CC27E6800A56D6F43D2080543B5BC1A3E9E209B95918D76A8D",
  "world4_haze_overlay_v01.png":
    "A9FFC0E062A43B033D3D68F070D43D49870B88D45B085B4755E6E6F65B634894",
  "world4_table_contact_shadow_v01.png":
    "8CB221897A5DF758648388B145BB18B2AFC3754475725355030B824CAC88BD1A",
  "world4_table_lower_base_v01.png":
    "0602AE857B008BE7ED415B55A80EEF7E835A4E4DA2D8E9C0A8B2A158949CCCE6",
  "world4_table_front_edge_v01.png":
    "4FF8F9FB62AD0B2A906920EF34D75AE8CF10585CFB8B82916AE69DCFEB2D56CA",
  "world4_table_top_v01.png":
    "414D3DBF394ACC4C6649C46B6703400B8419E0EB912BA12ADAD36B56E9B74282",
  "world4_system_route_base_v01.png":
    "111B8855F3FFE68BE5EE27DB16317C26C389012BAA1E36B5E8202863151460AB",
  "world4_node_state_halo_sheet_v01.png":
    "FB8378FB34392D0067E166B6697AEAE42663A2A33310701CC552DCA186C31DBE",
  "world4_node_pedestal_v01.png":
    "53737E24F412E84035D491298800223236DE063CFB4B1D01828C5D20AAF53C70",
  "world4_node_plant_v01.png":
    "38106D67FD9A64296BE9E70730B9B4E20E52889016176F95F2D666DEFF222AA9",
  "world4_node_bionosifier_v01.png":
    "ACBF86CB92DF36CAD9B93099ACBEB515958A4C8F3EBDE34AB644659B782F2F53",
  "world4_node_esp32_v01.png":
    "07B39AF4BBBD88D070096BC20F7AD939F8303A2F9CF622674A879D39985637A0",
  "world4_node_midi_v01.png":
    "EFBF9E01170A6C9E3EF7EB60288EFDF45F1B48B04F497FFA41999165018266BD",
  "world4_node_wifi_udp_v01.png":
    "9BE6A05BA181AE4879EA60B198D4FA670225B7FDD11810C0B651B08C68517AC9",
  "world4_node_router_v01.png":
    "4C0311E9B8C396578A17ADD5AA6574EB542D87118031995A8774E56B9CB35625",
  "world4_node_central_system_v01.png":
    "069DDCF6DCA26053C067D649D8794A19C06D21307C0E725D2FE71AFF4DFF2EAA",
  "world4_node_sound_v01.png":
    "10D16B9595489553BF3326EE610D553BA12EBA4E52672CC3BBD41B37F9B6EB82",
  "world4_text_card_backplate_v01.png":
    "671C85418875F6AE70EA29D5E7D1AFDA4E3A761795949C0772BE9F974D480324",
  "world4_open_world5_button_backplate_v01.png":
    "BA8F1C704892A7DE229564340BCAD08CABF80946337A5458933ECFEC70ACA875",
} as const;

export const WORLD4_REJECTED_ASSET_FILENAME =
  "world4_node_top_object_master_v01.png";
