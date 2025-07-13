export const formatDate = (dateString) => {
  const dateObj = new Date(dateString);
  return dateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    });
  };
//   import RelatedArticleCard from '@/components/BlogDetails/RelatedArticleCard ';