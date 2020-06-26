import React from "react"
import { Link, graphql } from "gatsby"
import m from "moment"

import About from "../components/About"
import Layout from "../components/Layout"
import SEO from "../components/seo"

import { createLink } from "../components/externalLink"

const formatAuthorText = text => {
  const matches = text.match(/\((.*?)\)/)
  const githubUser = matches[1].replace("@", "")
  return createLink(
    text.replace(matches[0], ""),
    `https://github.com/${githubUser}`
  )
}

const AipPostTemplate = ({ data, pageContext }) => {
  const aip = data.markdownRemark
  const posts = data && data.allMarkdownRemark && data.allMarkdownRemark.edges

  const { previous, next, slug } = pageContext
  const updated = m(aip.frontmatter.updated).isValid()

  return (
    <Layout posts={posts}>
      <SEO title={aip.frontmatter.title} description={aip.excerpt} />

      <div className="Stack">
        <article className="Main">
          <header>
            <h1>
              AIP {aip.frontmatter.aip}: {aip.frontmatter.title}
            </h1>
            <p>
              <span>Author: {formatAuthorText(aip.frontmatter.author)}</span>
              <span>
                Status: <strong>{aip.frontmatter.status}</strong>
              </span>
              <span>
                - {createLink("Discussions", aip.frontmatter.discussions)}
              </span>
              <span>
                -{" "}
                {createLink(
                  "Raw",
                  `https://github.com/aave/aip/blob/master${slug.slice(
                    0,
                    -1
                  )}.md`
                )}
              </span>
              <span>
                Created: {aip.frontmatter.created}{" "}
                {updated &&
                  `(Updated: ${m(aip.frontmatter.updated).format(
                    "MMMM DD, YYYY"
                  )})`}
              </span>
            </p>
          </header>

          <section dangerouslySetInnerHTML={{ __html: aip.html }} />

          <footer className="AipPostTemplate__footer">
            <em>
              <About />
              Learn about the{" "}
              <Link to={"/"} rel="home">
                process here
              </Link>
              .
            </em>
          </footer>
        </article>

        <nav>
          <ul className="AipPostTemplate__nav">
            <li>
              {previous && (
                <a href={"/aips" + previous.fields.slug}>
                  {" "}
                  <span className="Arrow Arrow__prev" /> AIP {previous.frontmatter.aip}: {previous.frontmatter.title}
                </a>
              )}
            </li>
            <li>
              {next && (
                <a href={"/aips" + next.fields.slug}>
                  {" "}
                  AIP {next.frontmatter.aip}: {next.frontmatter.title} <span className="Arrow Arrow__next" />
                </a>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </Layout>
  )
}

export default AipPostTemplate

export const pageQuery = graphql`
  query AipPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    avatar: file(absolutePath: { regex: "/logo.png/" }) {
      childImageSharp {
        fixed(width: 30, height: 30) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    allMarkdownRemark(
      sort: { fields: frontmatter___aip, order: DESC }
      filter: { fields: { slug: { ne: "/" } } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            status
            aip
            title
          }
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        aip
        title
        status
        author
        discussions
        created(formatString: "MMMM DD, YYYY")
        updated
      }
    }
  }
`
