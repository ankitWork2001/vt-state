import React from 'react'
import CommentCard from './CommentCard'
import CommentForm from './CommentForm'

function CommentSection() {
  const comment = [
    {
      id:'1',
      image:'https://img.freepik.com/premium-photo/happy-man-ai-generated-portrait-user-profile_1119669-1.jpg?w=2000',
      username:'Anonymous',
      date:'February15,2025',
      massage:'Beginning my preparation with newspapers every Sunday,e content related to terms which I can’t understand to have a good taste of humanities ,articles,and your webpage as a compass which is wonderfully created with utmost relevance and clarity.i am in 4th sem of graduation and aspiring to do good for which your blog and experience are undoubtedly helpful.thank you sir for sharing all this.'
    },
    {
      id:'2',
      image:'https://img.freepik.com/premium-photo/happy-man-ai-generated-portrait-user-profile_1119669-1.jpg?w=2000',
      username:'Anonymous',
      date:'February15,2025',
      massage:'Beginning my preparation with newspapers every Sunday,e content related to terms which I can’t understand to have a good taste of humanities ,articles,and your webpage as a compass which is wonderfully created with utmost relevance and clarity.i am in 4th sem of graduation and aspiring to do good for which your blog and experience are undoubtedly helpful.thank you sir for sharing all this.'
    },
    {
      id:'3',
      image:'https://img.freepik.com/premium-photo/happy-man-ai-generated-portrait-user-profile_1119669-1.jpg?w=2000',
      username:'Anonymous',
      date:'February15,2025',
      massage:'Beginning my preparation with newspapers every Sunday,e content related to terms which I can’t understand to have a good taste of humanities ,articles,and your webpage as a compass which is wonderfully created with utmost relevance and clarity.i am in 4th sem of graduation and aspiring to do good for which your blog and experience are undoubtedly helpful.thank you sir for sharing all this.'
    },
  ]

  return (
    <div className='min-w-60 h-auto w-full max-w-full flex flex-col'>
      <h2 className='p-1 m-1 my-5 text-xl font-semibold border-l-2 border-slate-700 px-2 '>{`${comment.length } tought on this blog`}</h2>
      {comment.map((data, id)=>{
        return (<div key={id}>
          <CommentCard comment={data}/>
        </div>) 
      })}
      <CommentForm/>
    </div>
  )
}

export default CommentSection