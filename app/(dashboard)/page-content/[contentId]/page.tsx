import PageContentForm from "@/components/page-content/PageContentFormRefactored";

interface PageContentDetailProps {
  params: Promise<{
    contentId: string;
  }>;
}

const PageContentDetail = async ({ params }: PageContentDetailProps) => {
  const { contentId } = await params;
  return <PageContentForm contentId={contentId} />;
};

export default PageContentDetail;
