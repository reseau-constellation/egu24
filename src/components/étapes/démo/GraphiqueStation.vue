<template>
  <v-sheet width="100%" :height="hauteur" class="text-center mb-2">
    <div class="text-center">
      <div v-show="assezDeDonnées" ref="resizeRef" class="ma-6">
        <svg ref="svgRef" width="100%">
          <g class="x-axis" />
          <g class="y-axis" />
        </svg>
      </div>
      <v-card
        v-show="!assezDeDonnées"
        class="d-flex align-center text-center"
        variant="flat"
        :height="hauteur"
      >
        <v-card-text>
          <div class="mx-auto text-h6 text-center text-disabled">
            {{ t("démo.graphique.aucuneDonnée") }}
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-sheet>
</template>
<script setup lang="ts">
import {
  type Ref,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watchEffect,
} from "vue";
import {
  axisBottom,
  axisLeft,
  line,
  max,
  scaleLinear,
  scaleTime,
  select,
  extent,
} from "d3";
import { computed } from "vue";
import {
  எண்களைப்_பயன்படுத்து,
  கிளிமூக்கை_பயன்படுத்து,
} from "@lassi-js/kilimukku-vue";

const props = defineProps<{
  hauteur: number;
  vals?: { date: number; précip: number }[];
}>();

const { எண்ணை_வடிவூட்டு } = எண்களைப்_பயன்படுத்து();
const { மொழியாக்கம்_பயன்படுத்து } = கிளிமூக்கை_பயன்படுத்து();
const { $மொ: t } = மொழியாக்கம்_பயன்படுத்து();

const données = computed(() =>
  (props.vals || []).map((x) => ({
    date: new Date(x.date),
    précip: x.précip,
  })),
);
const svgRef = ref(null);

const assezDeDonnées = computed(() => {
  return !!données.value.length;
});

const mêmeJour = (d1: Date, d2: Date)=>{
  return d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();
}

const obtListeJours = function(début: Date, fin: Date) {
  for (var a=[], d=new Date(début); d<=new Date(fin); d.setDate(d.getDate()+1)) { 
    a.push(new Date(d));
  }
  return a;
};

const donnéesCumul = computed(()=>{
  const cumul: {
        date: Date;
        précip: number;
      }[] = [];
  const listeJours = obtListeJours(new Date(Math.min(...données.value.map(c=>c.date.getTime()))), new Date(Math.max(...données.value.map(c=>c.date.getTime()))));

  listeJours.forEach((j) => {
    const obsPourCeJour = données.value.filter(d=>mêmeJour(d.date, j));
    if (obsPourCeJour.length) {
      for (const obs of obsPourCeJour) {
        cumul.push({
          ...obs,
          précip:
            obs.précip + (cumul.length ? cumul[cumul.length - 1].précip : 0),
        });
      }
    } else {
      cumul.push({
        date: j,
        précip: cumul.length ? cumul[cumul.length - 1].précip : 0,
      })
    }
  }
  );
  return cumul;
})

const formatteurs: { [chiffre: string]: Ref<string> } = {};

const formatterChiffre = (x: number): string => {
  if (!formatteurs[x.toString()]) {
    formatteurs[x.toString()] = எண்ணை_வடிவூட்டு(x);
  }
  return formatteurs[x.toString()].value;
};

// https://dev.to/muratkemaldar/using-vue-3-with-d3-composition-api-3h1g
// https://stackoverflow.com/questions/28609929/how-to-display-second-y-axis-to-right-of-grouped-bar-chart-data-in-d3
onMounted(() => {
  const svg = select(svgRef.value);

  watchEffect(() => {
    const { width, height } = resizeState.dimensions;
    if (!(width && height)) return;

    const x = scaleTime()
      .domain(extent(données.value, (d) => d.date) as [Date, Date]) // input values...
      .range([0, width]); // ... output values

    const y = scaleLinear()
      .domain([0, max(donnéesCumul.value, (d) => d.précip)] as [number, number]) // input values...
      .range([height, 0]); // ... output values

    svg
      .selectAll<SVGSVGElement, unknown>(".line") // get all "existing" lines in svg
      .data([donnéesCumul.value]) // sync them with our data
      .join("path")

      // everything after .join() is applied to every "new" and "existing" element
      .attr("class", "line") // attach class (important for updating)

      .attr("fill", "none")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        line<{ date: Date; précip: number }>()
          .x((d: { date: Date; précip: number }) => x(d.date))
          .y((d: { date: Date; précip: number }) => y(d.précip)),
      );
    
    // https://d3-graph-gallery.com/graph/barplot_animation_start.html
    svg.selectAll<SVGSVGElement, unknown>(".bar")
      .data(données.value)
      .join("rect")
        // everything after .join() is applied to every "new" and "existing" element
        .attr("class", "bar") // attach class (important for updating)
        .attr("x", function(d) { return x(d.date); })
        .attr("y", function(d) { return y(d.précip); })
        .attr("width", 2)
        .attr("height", function(d) { return height - y(d.précip); })
        .attr("fill", "steelblue")

    // Animation
    svg.selectAll<SVGSVGElement, unknown>("bar")
      .transition()
      .duration(800)
      .attr("y", function(d) { return y((d as {
        date: Date;
        précip: number;
      }).précip); })
      .attr("height", function(d) { return height - y((d as {
        date: Date;
        précip: number;
      }).précip); })
      .delay((d,i) => i*100)

    // render axes with help of scales
    // (we let Vue render our axis-containers and let D3 populate the elements inside it)
    const xAxis = axisBottom(x);

    svg
      .select<SVGSVGElement>(".x-axis")
      .style("transform", `translateY(${height}px)`) // position on the bottom
      .call(xAxis)
      .append("text");

    const yAxis = axisLeft(y);

    yAxis.tickFormat((x) => formatterChiffre(x.valueOf()));
    svg.select<SVGSVGElement>(".y-axis").call(yAxis);
  });
});

const useResizeObserver = () => {
  // create a new ref,
  // which needs to be attached to an element in a template
  const resizeRef = ref();
  const resizeState = reactive<{
    dimensions: { width?: number; height?: number };
  }>({
    dimensions: {},
  });

  const observer = new ResizeObserver((entries) => {
    // called initially and on resize
    entries.forEach((entry) => {
      resizeState.dimensions = entry.contentRect;
    });
  });

  onMounted(() => {
    // set initial dimensions right before observing: Element.getBoundingClientRect()
    resizeState.dimensions = resizeRef.value.getBoundingClientRect();
    observer.observe(resizeRef.value);
  });

  onBeforeUnmount(() => {
    observer.unobserve(resizeRef.value);
  });

  // return to make them available to whoever consumes this hook
  return { resizeState, resizeRef };
};
const { resizeRef, resizeState } = useResizeObserver();
</script>
<style scoped>
svg {
  /* important for responsiveness */
  display: block;
  fill: none;
  stroke: none;
  width: 100%;
  height: 100%;
  overflow: visible;
}
</style>
