import React from "react";
import { User, Mail, Phone, MapPin, Briefcase, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CandidateData } from "@/types/resume-analyzer-types/candidate";

interface CandidateProfileProps {
  candidate: CandidateData;
}

export const CandidateProfile: React.FC<CandidateProfileProps> = ({
  candidate,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="bg-card-box border-border shadow-elegant p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
              {getInitials(candidate.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div>
              <h2 className="text-2xl font-bold">{candidate.name}</h2>
              <p className="text-lg text-muted-foreground">{candidate.title}</p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <a
                  href={`mailto:${candidate.email}`}
                  className="hover:text-primary transition-colors"
                >
                  {candidate.email}
                </a>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <a
                  href={`tel:${candidate.phone}`}
                  className="hover:text-primary transition-colors"
                >
                  {candidate.phone}
                </a>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{candidate.location}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <User className="w-5 h-5" />
            Professional Summary
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {candidate.summary}
          </p>
        </div>

        <Separator />

        {/* Experience */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Work Experience
          </h3>
          <div className="space-y-4">
            {candidate.experience.map((exp, index) => (
              <div
                key={index}
                className="border-l-2 border-primary/20 pl-4 pb-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-semibold">{exp.position}</h4>
                    <p className="text-primary font-medium">{exp.company}</p>
                  </div>
                  <Badge variant="outline" className="w-fit">
                    <Calendar className="w-3 h-3 mr-1" />
                    {exp.duration}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Education */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Education
          </h3>
          <div className="space-y-3">
            {candidate.education.map((edu, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div>
                  <h4 className="font-semibold">{edu.degree}</h4>
                  <p className="text-muted-foreground">{edu.institution}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{edu.year}</Badge>
                  {edu.gpa && (
                    <p className="text-sm text-muted-foreground mt-1">
                      GPA: {edu.gpa}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        {candidate.certifications.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-3">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.certifications.map((cert, index) => (
                  <Badge key={index} variant="secondary">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
