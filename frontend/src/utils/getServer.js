export function server() {
  return {
    getPlanes: async function () {
      try {
        const response = await fetch('api/plans');
        if (!response.ok) {
          throw new Error('Error al cargar los planes');
        }
        return await response.json();
      } catch (error) {
        console.error(error);
      }
    },
  };
}
