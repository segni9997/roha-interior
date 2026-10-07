import { useSearchParams } from "react-router-dom";
import InteriorProjectDetails from "./InteriorProjectDetails";
import ModelProjectDetails from "./ModelProjectDetails";

export function ProjectDetails() {
  const [searchParams] = useSearchParams();
  const projectTypeParam = searchParams.get("type") || "interior";

  if (projectTypeParam === "model") {
    return <ModelProjectDetails />;
  }

  return <InteriorProjectDetails />;
}

export default ProjectDetails;